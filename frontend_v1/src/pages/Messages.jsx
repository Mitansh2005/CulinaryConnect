import { useState, useEffect, useRef } from 'react';
import { getFreshIdToken, getUid } from '@/firebase/authUtils';
import axios from 'axios';
import { baseUrl } from '@/constants/constants';
import { format, isToday, isYesterday } from 'date-fns';
import { useDebounce } from '@/components/hooks/useDebounce';

export function MessageTemplate() {
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [messages, setMessages] = useState([]);
	const [messageInput, setMessageInput] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [filterTab, setFilterTab] = useState('all'); // all, unread, archived
	const [socket, setSocket] = useState(null);
	const [isTyping] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const messagesEndRef = useRef(null);
	const messagesContainerRef = useRef(null);
	const currentUserId = getUid();
	const debouncedSearchQuery = useDebounce(searchQuery, 300);

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

	const filteredUsers = users.filter((user) => {
		const matchesSearch = user.username?.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
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
				<span className="rounded-full border border-white/80 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-text-sub-light dark:border-white/10 dark:bg-white/10 dark:text-text-sub-dark">
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
		<div className="relative flex w-full h-[calc(100vh-80px)] overflow-hidden">
			{/* Conversation List Pane */}
			<div className="flex w-96 flex-shrink-0 flex-col border-r border-border-light/80 bg-white/92 dark:border-border-dark dark:bg-[#211c18]">
				<div className="p-5 pb-0">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-bold text-text-main-light dark:text-text-main-dark">Messages</h2>
						<button className="rounded-full p-2 text-primary transition-colors hover:bg-ember-50 dark:hover:bg-ember-500/10">
							<span className="material-symbols-outlined text-[20px]">edit_square</span>
						</button>
					</div>

					{/* Search Bar */}
					<div className="relative group mb-4">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<span className="material-symbols-outlined text-text-sub-light dark:text-text-sub-dark group-focus-within:text-primary transition-colors text-[20px]">
								search
							</span>
						</div>
						<input
							className="block w-full rounded-xl border border-border-light/80 bg-stone-50/90 py-2.5 pl-10 pr-3 text-sm font-normal text-text-main-light transition-all placeholder:text-text-sub-light focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-border-dark dark:bg-white/10 dark:text-text-main-dark dark:placeholder:text-text-sub-dark"
							placeholder="Search chefs or conversations..."
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					{/* Tabs */}
					<div className="flex border-b border-border-light dark:border-border-dark gap-6">
						<button
							onClick={() => setFilterTab('all')}
							className={`flex flex-col items-center justify-center border-b-[2px] pb-3 pt-1 px-1 transition-colors ${filterTab === 'all'
									? 'border-primary text-text-main-light dark:text-text-main-dark font-bold'
									: 'border-transparent text-text-sub-light hover:text-text-main-light dark:text-text-sub-dark dark:hover:text-text-main-dark'
								}`}
						>
							<span className="text-sm font-medium tracking-wide">All</span>
						</button>
						<button
							onClick={() => setFilterTab('unread')}
							className={`flex flex-col items-center justify-center border-b-[2px] pb-3 pt-1 px-1 transition-colors ${filterTab === 'unread'
									? 'border-primary text-text-main-light dark:text-text-main-dark font-bold'
									: 'border-transparent text-text-sub-light hover:text-text-main-light dark:text-text-sub-dark dark:hover:text-text-main-dark'
								}`}
						>
							<span className="text-sm font-semibold tracking-wide">Unread</span>
						</button>
						<button
							onClick={() => setFilterTab('archived')}
							className={`flex flex-col items-center justify-center border-b-[2px] pb-3 pt-1 px-1 transition-colors ${filterTab === 'archived'
									? 'border-primary text-text-main-light dark:text-text-main-dark'
									: 'border-b-transparent text-text-sub-light hover:text-text-main-light dark:text-text-sub-dark dark:hover:text-text-main-dark'
								}`}
						>
							<span className="text-sm font-semibold tracking-wide">Archived</span>
						</button>
					</div>
				</div>

				{/* Conversation List */}
				<div className="flex-1 overflow-y-auto">
					{filteredUsers.length === 0 ? (
						<div className="flex h-full flex-col items-center justify-center p-8 text-text-sub-light dark:text-text-sub-dark">
							<span className="material-symbols-outlined text-[48px] mb-2">chat_bubble</span>
							<p className="text-sm text-center">No conversations yet</p>
						</div>
					) : (
						filteredUsers.map((user) => (
							<div
								key={user.uid}
								onClick={() => setSelectedUser(user)}
								className={`flex items-center gap-3 px-5 py-4 cursor-pointer transition-colors border-r-4 ${selectedUser?.uid === user.uid
										? 'border-primary bg-primary/6 dark:bg-primary/10'
										: 'border-transparent hover:bg-stone-50/80 dark:hover:bg-white/5'
									}`}
							>
								<div className="relative shrink-0">
									<div
										className="h-12 w-12 rounded-full border border-border-light bg-stone-100 bg-cover bg-center bg-no-repeat dark:border-border-dark dark:bg-[#332b25]"
										style={
											user.profile_picture
												? { backgroundImage: `url(${user.profile_picture})` }
												: {}
										}
									>
										{!user.profile_picture && (
											<div className="flex h-full w-full items-center justify-center text-sm font-bold text-text-sub-light dark:text-text-sub-dark">
												{user.username?.charAt(0).toUpperCase()}
											</div>
										)}
									</div>
									{/* Online indicator - can be added when backend supports it */}
								</div>
								<div className="flex flex-col flex-1 min-w-0">
									<div className="flex justify-between items-baseline mb-0.5">
										<p className="truncate text-sm font-bold text-text-main-light dark:text-text-main-dark">
											{user.username}
										</p>
										<p className="whitespace-nowrap text-xs font-medium text-text-sub-light dark:text-text-sub-dark">
											{/* Time would come from last message */}
										</p>
									</div>
									<p className="truncate text-xs font-normal text-text-sub-light dark:text-text-sub-dark/80">
										{/* Last message preview */}
									</p>
								</div>
							</div>
						))
					)}
				</div>
			</div>

			{/* Chat Window */}
			<main className="flex min-w-0 flex-1 flex-col bg-background-light dark:bg-background-dark">
				{selectedUser ? (
					<>
						{/* Chat Header */}
						<header className="z-10 flex h-[72px] shrink-0 items-center justify-between border-b border-border-light/80 bg-white/92 px-6 dark:border-border-dark dark:bg-[#211c18]">
							<div className="flex items-center gap-4">
								<div
									className="h-10 w-10 rounded-full border border-border-light bg-stone-100 bg-cover bg-center bg-no-repeat dark:border-border-dark dark:bg-[#332b25]"
									style={
										selectedUser.profile_picture
											? { backgroundImage: `url(${selectedUser.profile_picture})` }
											: {}
									}
								>
									{!selectedUser.profile_picture && (
										<div className="flex h-full w-full items-center justify-center text-xs font-bold text-text-sub-light dark:text-text-sub-dark">
											{selectedUser.username?.charAt(0).toUpperCase()}
										</div>
									)}
								</div>
								<div>
									<h3 className="mb-1 text-base font-bold leading-none text-text-main-light dark:text-text-main-dark">
										{selectedUser.username}
									</h3>
									<div className="flex items-center gap-2">
										<span className="text-xs font-medium text-secondary dark:text-secondary">
											{selectedUser.user_type === 'chef' ? 'Chef' : 'Restaurant'}
										</span>
									</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<button className="flex items-center gap-2 rounded-lg border border-border-light/80 px-4 py-2 text-sm font-medium text-text-main-light transition-colors hover:bg-stone-50 dark:border-border-dark dark:text-text-main-dark dark:hover:bg-white/5">
									View Profile
								</button>
								<button className="rounded-lg p-2 text-text-sub-light transition-colors hover:bg-stone-100 dark:text-text-sub-dark dark:hover:bg-white/5">
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
													className="mb-1 h-8 w-8 shrink-0 self-end rounded-full bg-stone-100 bg-cover bg-center bg-no-repeat dark:bg-[#332b25]"
													style={
														selectedUser.profile_picture
															? { backgroundImage: `url(${selectedUser.profile_picture})` }
															: {}
													}
												>
													{!selectedUser.profile_picture && (
														<div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-text-sub-light dark:text-text-sub-dark">
															{selectedUser.username?.charAt(0).toUpperCase()}
														</div>
													)}
												</div>
											)}

											<div className={`flex flex-col gap-1 ${isSent ? 'items-end' : ''}`}>
												<div
													className={`rounded-xl border border-border-light/60 p-4 shadow-sm ${isSent
															? 'rounded-tr-sm bg-primary/14 dark:bg-primary/22'
															: 'rounded-tl-sm bg-white/95 dark:bg-[#241f1b]'
														}`}
												>
													<p className="text-sm leading-relaxed text-text-main-light dark:text-text-main-dark">
														{msg.content}
													</p>
												</div>
												<div className={`flex items-center gap-1 ${isSent ? 'mr-1' : 'ml-1'}`}>
													<span className="text-text-sub-light dark:text-text-sub-dark text-[10px] font-medium tracking-wide border-t border-transparent mt-1">
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
										className="mb-1 h-8 w-8 shrink-0 self-end rounded-full bg-stone-100 bg-cover bg-center bg-no-repeat opacity-50 dark:bg-[#332b25]"
										style={
											selectedUser.profile_picture
												? { backgroundImage: `url(${selectedUser.profile_picture})` }
												: {}
										}
									/>
									<div className="self-start rounded-2xl rounded-bl-none border border-border-light/60 bg-white/95 px-4 py-3 shadow-sm dark:border-border-dark dark:bg-[#241f1b]">
										<div className="flex gap-1 items-center h-4">
											<div
												className="h-2 w-2 animate-bounce rounded-full bg-text-sub-light dark:bg-text-sub-dark"
												style={{ animationDelay: '0s' }}
											></div>
											<div
												className="h-2 w-2 animate-bounce rounded-full bg-text-sub-light dark:bg-text-sub-dark"
												style={{ animationDelay: '0.1s' }}
											></div>
											<div
												className="h-2 w-2 animate-bounce rounded-full bg-text-sub-light dark:bg-text-sub-dark"
												style={{ animationDelay: '0.2s' }}
											></div>
										</div>
									</div>
								</div>
							)}

							<div ref={messagesEndRef} />
						</div>

						{/* Input Area */}
						<div className="shrink-0 border-t border-border-light/80 bg-white/92 p-4 dark:border-border-dark dark:bg-[#211c18]">
							<div className="flex items-end gap-2 max-w-4xl mx-auto">
								<button className="rounded-full p-3 text-text-sub-light transition-colors hover:bg-stone-100 hover:text-secondary dark:text-text-sub-dark dark:hover:bg-white/5 dark:hover:text-text-main-dark">
									<span className="material-symbols-outlined text-[24px]">add_circle</span>
								</button>
								<div className="flex flex-1 items-center rounded-xl border border-border-light bg-stone-50/90 shadow-sm transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 dark:border-border-dark dark:bg-white/10">
									<textarea
										className="max-h-32 min-h-[48px] w-full resize-none border-none bg-transparent px-4 py-3 text-text-main-light placeholder:text-text-sub-light focus:ring-0 dark:text-text-main-dark dark:placeholder:text-text-sub-dark"
										placeholder="Type your message..."
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
										<button className="rounded-full p-2 text-text-sub-light transition-colors hover:bg-white/70 hover:text-text-main-light dark:text-text-sub-dark dark:hover:bg-white/10 dark:hover:text-text-main-dark">
											<span className="material-symbols-outlined text-[20px]">
												sentiment_satisfied
											</span>
										</button>
										<button className="rounded-full p-2 text-text-sub-light transition-colors hover:bg-white/70 hover:text-text-main-light dark:text-text-sub-dark dark:hover:bg-white/10 dark:hover:text-text-main-dark">
											<span className="material-symbols-outlined text-[20px]">attach_file</span>
										</button>
									</div>
								</div>
								<button
									onClick={sendMessage}
									disabled={!messageInput.trim()}
									className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-ember-500 to-ember-600 text-primary-foreground shadow-md shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
								>
									<span className="material-symbols-filled text-[24px]">send</span>
								</button>
							</div>
						</div>
					</>
				) : (
					<div className="flex flex-1 flex-col items-center justify-center text-text-sub-light dark:text-text-sub-dark">
						<span className="material-symbols-outlined text-[64px] mb-4">chat_bubble</span>
						<p className="text-lg font-medium">Select a conversation to start messaging</p>
					</div>
				)}
			</main>
		</div>
	);
}
