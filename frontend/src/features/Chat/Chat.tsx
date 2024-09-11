import React, { useState, useEffect, useRef } from 'react';
import useSocket from '../../app/hooks/useSocket';
import { User } from '../../app/models/user';
import axiosClient from '../../app/services/axiosClient';
import LoadingSpinner from '../../app/layout/LoadingSpinner';
import './Chat.css';
import useChat from '../../app/hooks/useChat';
import { useNavigate } from 'react-router-dom';

interface ChatProps {
  userId: string | undefined;
  userProfile: User | null;
  receiverId: string | undefined;
}

interface Message {
  senderId: string;
  receiverId: string;
  text: string;
}

const Chat: React.FC<ChatProps> = ({ userId, receiverId, userProfile }) => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const { socket } = useSocket();
  const [loading, setLoading] = useState<boolean>(true);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [otherTyping, setOtherUserTyping] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const { setChatOpen } = useChat();
  const [collapsed, setCollapsed] = useState<boolean>(false); // Collapsed state
  const navigate = useNavigate();

  let typingTimeout: number;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollTo = (position: number) => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: position,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    // Reset the chat when the receiverId changes
    if (!userId || !receiverId || !socket) return;

    // Reset messages and pagination when user changes
    setMessages([]);
    setPage(1);
    setLoading(true);

    const loadMessages = async (pageNumber: number) => {
      setLoadingMore(true);
      try {
        const previousScrollHeight = messagesContainerRef.current?.scrollHeight || 0;

        const dataResponse = await axiosClient.get(
          `http://localhost:3000/messages/${userId}/${receiverId}/${pageNumber}`
        );

        setMessages((prevMessages) => [...dataResponse.data.data, ...prevMessages]);

        if (pageNumber === 1) {
          setTimeout(() => {
            scrollToBottom();
          }, 100);
        } else {
          setTimeout(() => {
            if (messagesContainerRef.current) {
              const newScrollHeight = messagesContainerRef.current.scrollHeight;
              scrollTo(newScrollHeight - previousScrollHeight);
            }
          }, 100);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingMore(false);
        setLoading(false);
      }
    };

    loadMessages(page);

    socket.on('connect', () => {
      socket.emit('join', { userId, socketId: socket.id });
    });

    socket.on('message', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      scrollToBottom();
    });

    socket.on('typing', (data) => {
      if (data.senderId !== userId) {
        setOtherUserTyping(true);
        if (typingTimeout) {
          clearTimeout(typingTimeout);
        }

        typingTimeout = setTimeout(() => {
          setOtherUserTyping(false);
        }, 2000);
      }
    });

    // Clean up listeners when component unmounts or receiverId changes
    return () => {
      socket.off('connect');
      socket.off('message');
      socket.off('typing');
    };
  }, [userId, receiverId, socket, page]);

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop } = messagesContainerRef.current;
      if (scrollTop === 0 && !loadingMore) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  const handleTyping = () => {
    setIsTyping(true);
    socket?.emit('typing', { senderId: userId, receiverId });
    if (typingTimeout) window.setTimeout(() => setIsTyping(false), 2000);
  };

  const sendMessage = async () => {
    if (message.trim() && userId && receiverId) {
      const newMessage = {
        senderId: userId,
        receiverId: receiverId,
        text: message,
      };
      socket?.emit('message', newMessage);

      await axiosClient.post('http://localhost:3000/newMessage', newMessage);
      setMessage('');
      scrollToBottom();
    }
  };

  return (
    <div className={`fixed bottom-0 left-0 w-80 ${collapsed ? 'h-10' : 'h-96'} bg-white shadow-lg rounded-lg flex flex-col transition-height duration-300`}>
      {/* Chat header */}
      <div
        className="bg-indigo-600 text-white p-2 rounded-t-lg flex justify-between items-center cursor-pointer"
        onClick={() => setCollapsed(!collapsed)} // Toggle collapse on header click
      >
        <span className='hover:text-gray-400 transform transition duration-200' onClick={() => {navigate(`/users/${userProfile?.id}`) 
                                                                                                setChatOpen(false)}}>{userProfile?.firstName}</span>
        <button
          onClick={() => setChatOpen(false)}
          className="text-white hover:text-gray-200 transition focus:outline-none"
        >
          &#x2715;
        </button>
      </div>

      {/* Chat body (messages and input) */}
      {!collapsed && (
        <>
          <div
            className="flex-1 p-4 overflow-y-auto max-h-96 space-y-2 custom-scrollbar"
            onScroll={handleScroll}
            ref={messagesContainerRef}
          >
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                {loadingMore && <div className="text-center text-sm">Loading more...</div>}
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.senderId == userId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`p-2 rounded-lg text-sm inline-block max-w-[75%] break-words ${
                        msg.senderId == userId
                          ? 'bg-indigo-500 text-white ml-auto'
                          : 'bg-gray-200 text-black mr-auto'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </>
            )}
            {otherTyping && (
              <div className="flex items-center space-x-1 mt-2">
                <span className="text-gray-600 text-xs">Typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center border-t p-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-lg focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage();
                else handleTyping();
              }}
            />
            <i
              onClick={sendMessage}
              className="ml-2 cursor-pointer text-indigo-600 p-2 rounded-lg hover:bg-indigo-100 transition fa-regular fa-paper-plane"
            ></i>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
