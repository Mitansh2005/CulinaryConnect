import asyncio
import datetime
import websockets
import json
import os
import sys
import django
import queue
import threading

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "chefWeb.settings")
django.setup()
from myapp.models import CustomUser, Message

db_write_queue = queue.Queue()
connected_users = {}  # user_id: websocket


def db_worker():
    """
    Worker thread that saves messages to the DB.
    Runs synchronously in a background thread.
    """
    while True:
        content = db_write_queue.get()
        if content is None:
            print("DB worker shutting down.")
            break
        try:
            sender_id = content["sender"]
            recipient_id = content["recipient"]
            text = content["text"]
            timestamp = content["timestamp"]

            sender = CustomUser.objects.get(uid=sender_id)
            recipient = CustomUser.objects.get(uid=recipient_id)

            Message.objects.create(
                sender=sender, receiver=recipient, content=text, timestamp=timestamp
            )
            print(f"✅ Message saved to DB: {sender} → {recipient}")
        except Exception as e:
            print(f"❌ Error saving message to DB: {e}")

        db_write_queue.task_done()


async def chat_handler(websocket):
    user_id = None
    try:
        # Automatically identify on connect
        initial_msg = await websocket.recv()
        data = json.loads(initial_msg)

        user_id = data["user_id"]
        if not user_id:
            await websocket.send(json.dumps({"error": "Missing user_id"}))
            return
        if user_id in connected_users:
            old_ws = connected_users[user_id]
            await old_ws.close()
        connected_users[user_id] = websocket
        print(f"{user_id} connected.")

        # Now listen for chat messages
        async for msg in websocket:
            data = json.loads(msg)
            recipient_id = data["to"]
            text = data["text"]
            if not user_id:
                await websocket.send(json.dumps({"error": "Missing user_id"}))
                return
            now = datetime.datetime.now()

            db_write_queue.put(
                {
                    "sender": user_id,
                    "recipient": recipient_id,
                    "text": text,
                    "timestamp": now,
                }
            )
            # To push the message to receipient if online otherwise save the message
            recipient_ws = connected_users.get(recipient_id)
            if recipient_ws:
                await recipient_ws.send(
                    json.dumps(
                        {"from": user_id, "text": text, "timestamp": now.isoformat()}
                    )
                )
                print(f"➡️ Forwarded message from {user_id} → {recipient_id}")
            else:
                await websocket.send(
                    json.dumps({"error": f"User {recipient_id} is not connected"})
                )

    except websockets.exceptions.ConnectionClosed:
        print(f"{user_id} disconnected.")
    finally:
        if user_id:
            if user_id in connected_users:
                del connected_users[user_id]
                print(f"🔴 {user_id} disconnected and removed.")
        else:
            print("Unknown connection disconnected before registration.")


async def main():
    # Start DB worker thread
    threading.Thread(target=db_worker, daemon=True).start()
    print("🛠️  DB worker started.")

    async with websockets.serve(chat_handler, "localhost", 8765):
        print("🚀 WebSocket server running at ws://localhost:8765")
        await asyncio.Future()  # Run forever


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n Server shutting down...")
        db_write_queue.put(None)  # send sentinel to stop worker
