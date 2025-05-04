
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { conversationService, messageService } from '@/services/data.service';
import { Conversation, Message } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Send, User, MessageCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const Messages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Parse URL query params to see if we should open a specific conversation
  const queryParams = new URLSearchParams(location.search);
  const withUserId = queryParams.get('with');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please log in to view your messages');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const data = await conversationService.getByUserId(currentUser.id);
        setConversations(data);
        
        // If URL has a 'with' parameter, find or create that conversation
        if (withUserId && currentUser.id !== withUserId) {
          // Check if conversation already exists
          let existingConv = data.find(conv => 
            conv.participantIds.includes(withUserId)
          );
          
          if (!existingConv) {
            // Create a new conversation
            // In a real app, we would fetch the other user's details from the API
            const newConv = await conversationService.findOrCreateConversation(
              currentUser.id,
              withUserId,
              currentUser.name,
              `User ${withUserId}` // Placeholder, in real app would fetch user name
            );
            
            setSelectedConversation(newConv);
            setConversations(prev => [...prev, newConv]);
          } else {
            setSelectedConversation(existingConv);
          }
        } else if (data.length > 0) {
          // Select first conversation by default
          setSelectedConversation(data[0]);
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Failed to load your conversations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [currentUser, withUserId]);

  // Fetch messages when selected conversation changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return;
      
      try {
        const data = await messageService.getByConversationId(selectedConversation.id);
        setMessages(data);
        
        // Mark messages as read
        if (currentUser) {
          await messageService.markAsRead(selectedConversation.id, currentUser.id);
          await conversationService.updateUnreadCount(selectedConversation.id, currentUser.id);
          
          // Update conversation in state
          setConversations(prevConversations => 
            prevConversations.map(conv => 
              conv.id === selectedConversation.id ? { ...conv, unreadCount: 0 } : conv
            )
          );
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
  }, [selectedConversation, currentUser]);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send a new message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !selectedConversation || !newMessage.trim()) return;
    
    try {
      setSendingMessage(true);
      
      // Find the other participant in the conversation
      const otherParticipantId = selectedConversation.participantIds.find(
        id => id !== currentUser.id
      );
      
      if (!otherParticipantId) {
        throw new Error('Could not find other participant');
      }
      
      // Send the message
      const sentMessage = await messageService.sendMessage(selectedConversation.id, {
        senderId: currentUser.id,
        receiverId: otherParticipantId,
        content: newMessage.trim()
      });
      
      // Update local state
      setMessages([...messages, sentMessage]);
      setNewMessage('');
      
      // Update conversation with last message
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === selectedConversation.id 
            ? { 
                ...conv, 
                lastMessage: newMessage.trim(),
                lastMessageDate: new Date().toISOString()
              } 
            : conv
        )
      );
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  // Format timestamp to readable time
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for conversation list
  const formatConversationDate = (timestamp?: string) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get the other participant's name
  const getOtherParticipantName = (conversation: Conversation) => {
    if (!currentUser) return '';
    
    const currentUserIndex = conversation.participantIds.indexOf(currentUser.id);
    if (currentUserIndex === -1) return '';
    
    const otherIndex = currentUserIndex === 0 ? 1 : 0;
    return conversation.participantNames[otherIndex];
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <LoadingSpinner size="large" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
          {/* Conversation List */}
          <div className="bg-white rounded-lg shadow overflow-hidden md:col-span-1">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-medium">Conversations</h2>
              </div>
              
              {conversations.length === 0 ? (
                <div className="p-6 flex-grow flex items-center justify-center text-center">
                  <div>
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No conversations yet</p>
                  </div>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 overflow-y-auto flex-grow">
                  {conversations.map((conversation) => (
                    <li
                      key={conversation.id}
                      className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation?.id === conversation.id ? 'bg-gray-50' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {getOtherParticipantName(conversation)}
                          </p>
                          {conversation.lastMessage && (
                            <p className="text-sm text-gray-500 truncate">
                              {conversation.lastMessage}
                            </p>
                          )}
                        </div>
                        <div className="ml-3 flex flex-col items-end">
                          {conversation.lastMessageDate && (
                            <p className="text-xs text-gray-500">
                              {formatConversationDate(conversation.lastMessageDate)}
                            </p>
                          )}
                          {conversation.unreadCount > 0 && (
                            <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center mt-1">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          {/* Message Area */}
          <div className="bg-white rounded-lg shadow overflow-hidden md:col-span-2">
            {!selectedConversation ? (
              <div className="h-full flex items-center justify-center p-6 text-center">
                <div>
                  <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No conversation selected</p>
                  <p className="text-sm text-gray-400">
                    Select a conversation from the list or start a new one
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <User className="h-4 w-4 text-gray-500" />
                    </div>
                    <h2 className="font-medium">{getOtherParticipantName(selectedConversation)}</h2>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center">
                      <p className="text-gray-500">No messages yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => {
                        const isCurrentUser = currentUser && message.senderId === currentUser.id;
                        
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                isCurrentUser
                                  ? 'bg-primary text-white rounded-tr-none'
                                  : 'bg-white border border-gray-200 rounded-tl-none'
                              }`}
                            >
                              <p>{message.content}</p>
                              <p
                                className={`text-xs mt-1 text-right ${
                                  isCurrentUser ? 'text-white/70' : 'text-gray-500'
                                }`}
                              >
                                {formatMessageTime(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>
                
                {/* Message Input */}
                <form className="p-4 border-t border-gray-200" onSubmit={handleSendMessage}>
                  <div className="flex">
                    <input
                      type="text"
                      className="input-field rounded-r-none flex-1"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={sendingMessage}
                    />
                    <button
                      type="submit"
                      className="btn-primary rounded-l-none"
                      disabled={!newMessage.trim() || sendingMessage}
                    >
                      {sendingMessage ? <LoadingSpinner size="small" /> : <Send className="h-5 w-5" />}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Messages;
