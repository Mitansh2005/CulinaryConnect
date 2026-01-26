import { useState, useEffect, useRef } from 'react';
import { getFreshIdToken, getUid } from '@/firebase/authUtils';
import axios from 'axios';
import { baseUrl } from '@/constants/constants';
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';

export function MessageTemplate() {
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [messages, setMessages] = useState([]);
	const [messageInput, setMessageInput] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [filterTab, setFilterTab] = useState('all'); // all, unread, archived
	const [socket, setSocket] = useState(null);
	const [isTyping, setIsTyping] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const messagesEndRef = useRef(null);
	const messagesContainerRef = useRef(null);
	const currentUserId = getUid();

	// WebSocket connection
	useEffect(() => {
		const ws = new WebSocket('ws://localhost:8765');

		ws.onopen = () => {
			console.log('WebSocket connected');
			ws.send(JSON.stringify({ type: 'register', user_id: currentUserId }));
		};

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);

			if (data.type === 'message') {
				setMessages((prev) => [
					...prev,
					{
						sender: { uid: data.from },
						receiver: { uid: data.to },
						content: data.text,
						timestamp: new Date().toISOString(),
						read: false,
					},
				]);
				scrollToBottom();
			}
		};

		ws.onerror = (error) => {
			console.error('WebSocket error:', error);
		};

		ws.onclose = () => {
			console.log('WebSocket disconnected');
		};

		setSocket(ws);

		return () => {
			if (ws.readyState === WebSocket.OPEN) {
				ws.close();
			}
		};
	}, [currentUserId]);

	// Fetch users for messaging
	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			const token = await getFreshIdToken();
			const response = await axios.get(`${baseUrl}/message/profile/`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setUsers(response.data);
		} catch (error) {
			console.error('Failed to fetch users:', error);
		}
	};

	// Fetch messages when user is selected
	useEffect(() => {
		if (selectedUser) {
			fetchMessages(currentUserId, selectedUser.uid);
		}
	}, [selectedUser, currentUserId]);

	const fetchMessages = async (sender, receiver, before = null) => {
		try {
			const token = await getFreshIdToken();
			let url = `${baseUrl}/get-messages/${sender}/${receiver}/`;
			if (before) {
				url += `?before=${before}`;
			}

			const response = await axios.get(url, {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (before) {
				setMessages((prev) => [...response.data.messages.reverse(), ...prev]);
			} else {
				setMessages(response.data.messages.reverse());
				setTimeout(scrollToBottom, 100);
			}

			setHasMore(response.data.has_more);
		} catch (error) {
			console.error('Failed to fetch messages:', error);
		}
	};

	const sendMessage = () => {
		if (!selectedUser?.uid || !messageInput.trim() || !socket) return;

		socket.send(
			JSON.stringify({
				type: 'message',
				to: selectedUser.uid,
				text: messageInput.trim(),
			})
		);

		// Optimistically add message to UI
		setMessages((prev) => [
			...prev,
			{
				sender: { uid: currentUserId },
				receiver: { uid: selectedUser.uid },
				content: messageInput.trim(),
				timestamp: new Date().toISOString(),
				read: false,
			},
		]);

		setMessageInput('');
		scrollToBottom();
	};

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	const handleScroll = () => {
		const container = messagesContainerRef.current;
		if (container && container.scrollTop === 0 && hasMore && messages.length > 0) {
			const oldestMessage = messages[0];
			fetchMessages(currentUserId, selectedUser.uid, oldestMessage.timestamp);
		}
	};

	const formatMessageTime = (timestamp) => {
		const date = new Date(timestamp);
		if (isToday(date)) {
			return format(date, 'h:mm a');
		} else if (isYesterday(date)) {
			return 'Yesterday';
		} else {
			return format(date, 'MMM d');
		}
	};

	const formatConversationTime = (timestamp) => {
		const date = new Date(timestamp);
		const now = new Date();
		const diffInMinutes = Math.floor((now - date) / (1000 * 60));

		if (diffInMinutes < 1) return 'Just now';
		if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
		if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
		return `${Math.floor(diffInMinutes / 1440)}d ago`;
	};

	const filteredUsers = users.filter((user) => {
		const matchesSearch = user.username?.toLowerCase().includes(searchQuery.toLowerCase());
		// Add filter logic for unread/archived when backend supports it
		return matchesSearch;
	});

	const renderDateSeparator = (timestamp) => {
		const date = new Date(timestamp);
		let label = format(date, 'MMM d');
		if (isToday(date)) label = 'Today';
		if (isYesterday(date)) label = 'Yesterday';

		return (
			<div className="flex justify-center my-4">
				<span className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
					{label}
				</span>
			</div>
		);
	};

	const shouldShowDateSeparator = (currentMsg, prevMsg) => {
		if (!prevMsg) return true;
		const currentDate = new Date(currentMsg.timestamp).toDateString();
		const prevDate = new Date(prevMsg.timestamp).toDateString();
		return currentDate !== prevDate;
	};

	return (
		<div className="flex flex-1 overflow-hidden relative">
			{/* Conversation List Pane */}
			<div className="w-96 flex-shrink-0 flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#12231b]">
				<div className="p-5 pb-0">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-bold text-[#111813] dark:text-white">Messages</h2>
						<button className="text-primary hover:bg-primary/10 rounded-full p-2 transition-colors">
							<span className="material-symbols-outlined text-[20px]">edit_square</span>
						</button>
					</div>

					{/* Search Bar */}
					<div className="relative group mb-4">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<span className="material-symbols-outlined text-[#61896f] group-focus-within:text-primary transition-colors text-[20px]">
								search
							</span>
						</div>
						<input
							className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-[#f0f4f2] dark:bg-white/5 text-[#111813] dark:text-white placeholder-[#61896f] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-normal"
							placeholder="Search chefs or conversations..."
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					{/* Tabs */}
					<div className="flex border-b border-[#dbe6df] dark:border-gray-700 gap-6">
						<button
							onClick={() => setFilterTab('all')}
							className={`flex flex-col items-center justify-center border-b-[2px] pb-3 pt-1 px-1 transition-colors ${filterTab === 'all'
									? 'border-b-[#111813] dark:border-b-white text-[#111813] dark:text-white'
									: 'border-b-transparent text-[#61896f] hover:text-[#111813] dark:text-gray-400 dark:hover:text-white'
								}`}
						>
							<span className="text-sm font-semibold tracking-wide">All</span>
						</button>
						<button
							onClick={() => setFilterTab('unread')}
							className={`flex flex-col items-center justify-center border-b-[2px] pb-3 pt-1 px-1 transition-colors ${filterTab === 'unread'
									? 'border-b-[#111813] dark:border-b-white text-[#111813] dark:text-white'
									: 'border-b-transparent text-[#61896f] hover:text-[#111813] dark:text-gray-400 dark:hover:text-white'
								}`}
						>
							<span className="text-sm font-semibold tracking-wide">Unread</span>
						</button>
						<button
							onClick={() => setFilterTab('archived')}
							className={`flex flex-col items-center justify-center border-b-[2px] pb-3 pt-1 px-1 transition-colors ${filterTab === 'archived'
									? 'border-b-[#111813] dark:border-b-white text-[#111813] dark:text-white'
									: 'border-b-transparent text-[#61896f] hover:text-[#111813] dark:text-gray-400 dark:hover:text-white'
								}`}
						>
							<span className="text-sm font-semibold tracking-wide">Archived</span>
						</button>
					</div>
				</div>

				{/* Conversation List */}
				<div className="flex-1 overflow-y-auto">
					{filteredUsers.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
							<span className="material-symbols-outlined text-[48px] mb-2">chat_bubble</span>
							<p className="text-sm text-center">No conversations yet</p>
						</div>
					) : (
						filteredUsers.map((user) => (
							<div
								key={user.uid}
								onClick={() => setSelectedUser(user)}
								className={`flex items-center gap-3 px-5 py-4 cursor-pointer transition-colors border-r-4 ${selectedUser?.uid === user.uid
										? 'bg-primary/5 dark:bg-primary/10 border-primary'
										: 'border-transparent hover:bg-gray-50 dark:hover:bg-white/5'
									}`}
							>
								<div className="relative shrink-0">
									<div
										className="bg-center bg-no-repeat bg-cover rounded-full h-12 w-12 border border-gray-200 dark:border-gray-600 bg-gray-200 dark:bg-gray-700"
										style={
											user.profile_picture
												? { backgroundImage: `url(${user.profile_picture})` }
												: {}
										}
									>
										{!user.profile_picture && (
											<div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-sm">
												{user.username?.charAt(0).toUpperCase()}
											</div>
										)}
									</div>
									{/* Online indicator - can be added when backend supports it */}
								</div>
								<div className="flex flex-col flex-1 min-w-0">
									<div className="flex justify-between items-baseline mb-0.5">
										<p className="text-[#111813] dark:text-white text-sm font-bold truncate">
											{user.username}
										</p>
										<p className="text-[#61896f] dark:text-gray-400 text-xs font-normal whitespace-nowrap">
											{/* Time would come from last message */}
										</p>
									</div>
									<p className="text-[#61896f] dark:text-gray-500 text-xs font-normal truncate">
										{/* Last message preview */}
									</p>
								</div>
							</div>
						))
					)}
				</div>
			</div>

			{/* Chat Window */}
			<main className="flex-1 flex flex-col bg-background-light dark:bg-background-dark min-w-0">
				{selectedUser ? (
					<>
						{/* Chat Header */}
						<header className="h-[72px] px-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#12231b] shrink-0 z-10">
							<div className="flex items-center gap-4">
								<div
									className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10 border border-gray-100 dark:border-gray-700 bg-gray-200 dark:bg-gray-700"
									style={
										selectedUser.profile_picture
											? { backgroundImage: `url(${selectedUser.profile_picture})` }
											: {}
									}
								>
									{!selectedUser.profile_picture && (
										<div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-xs">
											{selectedUser.username?.charAt(0).toUpperCase()}
										</div>
									)}
								</div>
								<div>
									<h3 className="text-[#111813] dark:text-white text-base font-bold leading-none mb-1">
										{selectedUser.username}
									</h3>
									<div className="flex items-center gap-2">
										<span className="text-[#61896f] dark:text-gray-400 text-xs font-medium">
											{selectedUser.user_type === 'chef' ? 'Chef' : 'Restaurant'}
										</span>
									</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-medium text-[#111813] dark:text-white transition-colors">
									View Profile
								</button>
								<button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors">
									<span className="material-symbols-outlined">more_vert</span>
								</button>
							</div>
						</header>

						{/* Messages Area */}
						<div
							ref={messagesContainerRef}
							onScroll={handleScroll}
							className="flex-1 overflow-y-auto p-6 flex flex-col gap-6"
						>
							{messages.map((msg, index) => {
								const isSent = msg.sender.uid === currentUserId;
								const showDateSeparator = shouldShowDateSeparator(msg, messages[index - 1]);

								return (
									<div key={index}>
										{showDateSeparator && renderDateSeparator(msg.timestamp)}

										<div
											className={`flex gap-4 max-w-[80%] ${isSent ? 'self-end justify-end' : ''
												}`}
										>
											{!isSent && (
												<div
													className="shrink-0 bg-center bg-no-repeat bg-cover rounded-full h-8 w-8 self-end mb-1 bg-gray-200 dark:bg-gray-700"
													style={
														selectedUser.profile_picture
															? { backgroundImage: `url(${selectedUser.profile_picture})` }
															: {}
													}
												>
													{!selectedUser.profile_picture && (
														<div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-[10px]">
															{selectedUser.username?.charAt(0).toUpperCase()}
														</div>
													)}
												</div>
											)}

											<div className={`flex flex-col gap-1 ${isSent ? 'items-end' : ''}`}>
												<div
													className={`p-4 rounded-2xl shadow-sm ${isSent
															? 'bg-primary/10 dark:bg-primary/10 rounded-br-none border border-primary/20'
															: 'bg-white dark:bg-[#1E2E25] rounded-bl-none border border-gray-100 dark:border-gray-800'
														}`}
												>
													<p className="text-[#111813] dark:text-gray-100 text-sm leading-relaxed">
														{msg.content}
													</p>
												</div>
												<div className={`flex items-center gap-1 ${isSent ? 'mr-1' : 'ml-1'}`}>
													<span className="text-gray-400 dark:text-gray-600 text-[10px] font-medium">
														{formatMessageTime(msg.timestamp)}
													</span>
													{isSent && (
														<span className="material-symbols-filled text-primary text-[14px]">
															{msg.read ? 'done_all' : 'done'}
														</span>
													)}
												</div>
											</div>
										</div>
									</div>
								);
							})}

							{/* Typing Indicator */}
							{isTyping && (
								<div className="flex gap-4 max-w-[80%]">
									<div
										className="shrink-0 bg-center bg-no-repeat bg-cover rounded-full h-8 w-8 self-end mb-1 opacity-50 bg-gray-200 dark:bg-gray-700"
										style={
											selectedUser.profile_picture
												? { backgroundImage: `url(${selectedUser.profile_picture})` }
												: {}
										}
									/>
									<div className="bg-white dark:bg-[#1E2E25] px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-800 self-start">
										<div className="flex gap-1 items-center h-4">
											<div
												className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
												style={{ animationDelay: '0s' }}
											></div>
											<div
												className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
												style={{ animationDelay: '0.1s' }}
											></div>
											<div
												className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
												style={{ animationDelay: '0.2s' }}
											></div>
										</div>
									</div>
								</div>
							)}

							<div ref={messagesEndRef} />
						</div>

						{/* Input Area */}
						<div className="p-4 bg-white dark:bg-[#12231b] border-t border-gray-200 dark:border-gray-800 shrink-0">
							<div className="flex items-end gap-2 max-w-4xl mx-auto">
								<button className="p-3 text-gray-400 hover:text-[#61896f] dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-white/5">
									<span className="material-symbols-outlined text-[24px]">add_circle</span>
								</button>
								<div className="flex-1 bg-[#f0f4f2] dark:bg-white/5 rounded-xl flex items-center border border-transparent focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
									<textarea
										className="w-full bg-transparent border-none text-[#111813] dark:text-white placeholder-[#61896f] focus:ring-0 px-4 py-3 resize-none max-h-32 min-h-[48px]"
										placeholder="Type a message..."
										rows="1"
										value={messageInput}
										onChange={(e) => setMessageInput(e.target.value)}
										onKeyPress={(e) => {
											if (e.key === 'Enter' && !e.shiftKey) {
												e.preventDefault();
												sendMessage();
											}
										}}
									/>
									<div className="flex items-center pr-2 gap-1">
										<button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
											<span className="material-symbols-outlined text-[20px]">
												sentiment_satisfied
											</span>
										</button>
										<button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
											<span className="material-symbols-outlined text-[20px]">attach_file</span>
										</button>
									</div>
								</div>
								<button
									onClick={sendMessage}
									disabled={!messageInput.trim()}
									className="bg-primary hover:bg-[#0fd650] text-[#052e12] h-12 w-12 rounded-xl flex items-center justify-center shadow-md shadow-primary/20 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<span className="material-symbols-filled text-[24px]">send</span>
								</button>
							</div>
						</div>
					</>
				) : (
					<div className="flex-1 flex flex-col items-center justify-center text-gray-400">
						<span className="material-symbols-outlined text-[64px] mb-4">chat_bubble</span>
						<p className="text-lg font-medium">Select a conversation to start messaging</p>
					</div>
				)}
			</main>
		</div>
	);
}
