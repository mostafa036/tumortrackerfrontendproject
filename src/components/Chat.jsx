import { useState, useEffect, useRef } from 'react';
import { signalRService } from '../services/signalRService';
import { useAuth } from '../context/AuthContext';

const Chat = ({ doctorId, patientId, patientName, onClose, onMessageSent }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem('token');
  const { user } = useAuth();
  const isDoctor = user?.role === 'Doctor';

  // Validate required props
  useEffect(() => {
    if (!doctorId) {
      console.error('Chat: doctorId is required');
      setError('Doctor ID is missing');
      setLoading(false);
      return;
    }

    if (!patientId) {
      console.error('Chat: patientId is required');
      setError('Patient ID is missing');
      setLoading(false);
      return;
    }

    if (!token) {
      console.error('Chat: No authentication token found');
      setError('Please log in again');
      setLoading(false);
      return;
    }
  }, [doctorId, patientId, token]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchWithAuth = async (url, options = {}) => {
    try {
      console.log('Making API request to:', url);
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers
        }
      });

      console.log('API Response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          console.error('Unauthorized access. Token may be invalid.');
          throw new Error('Unauthorized. Please log in again.');
        }
        const errorData = await response.json().catch(() => null);
        console.error('API Error Data:', errorData);
        throw new Error(errorData?.message || `Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response data:', data);
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      if (!patientId || !doctorId) {
        throw new Error('Missing required IDs');
      }

      console.log('Loading messages for chat between:', { doctorId, patientId });
      
      // Get chat messages using the appropriate ID based on role
      const receiverId = isDoctor ? patientId : doctorId;
      const data = await fetchWithAuth(
        `https://tumortraker12.runasp.net/api/Chat/GetChat?receiverId=${receiverId}`
      );
      
      if (!Array.isArray(data)) {
        console.error('Invalid message data format:', data);
        throw new Error('Invalid message data received');
      }

      // Transform messages to match the API schema
      const formattedMessages = data.map(msg => ({
        id: msg.id,
        senderId: msg.senderId,
        senderName: msg.senderName,
        receiverId: msg.receiverId,
        receiverName: msg.receiverName,
        message: msg.message,
        timestamp: msg.timestamp
      }));

      setMessages(formattedMessages);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error loading messages:', error);
      if (error.message.includes('Unauthorized')) {
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to load messages. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 2000; // 2 seconds

    const initialize = async () => {
      // Skip if required props are missing
      if (!doctorId || !patientId || !token) {
        return;
      }

      while (retryCount < maxRetries && mounted) {
        try {
          await loadMessages();
          
          // Connect to SignalR
          const connected = await signalRService.start();
          if (!connected) {
            throw new Error('Failed to connect to chat service');
          }
          
          break;
        } catch (error) {
          console.error(`Attempt ${retryCount + 1} failed:`, error);
          retryCount++;
          if (retryCount < maxRetries && mounted) {
            await new Promise(resolve => setTimeout(resolve, retryDelay * retryCount));
          }
        }
      }
    };

    initialize();

    // Listen for new messages
    const removeListener = signalRService.addMessageListener((senderId, message) => {
      const expectedSenderId = isDoctor ? patientId : doctorId;
      if (senderId === expectedSenderId && mounted) {
        console.log('New message received:', { senderId, message });
        setMessages(prev => [...prev, {
          id: Date.now(), // Temporary ID until refresh
          senderId,
          receiverId: isDoctor ? doctorId : patientId,
          message,
          timestamp: new Date().toISOString()
        }]);
        scrollToBottom();
      }
    });

    return () => {
      mounted = false;
      removeListener();
      signalRService.stop();
    };
  }, [patientId, doctorId, token, isDoctor]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const receiverId = isDoctor ? patientId : doctorId;
      await signalRService.sendMessage(receiverId, newMessage.trim());

      // Add message to local state
      setMessages(prev => [...prev, {
        id: Date.now(), // Temporary ID until refresh
        senderId: isDoctor ? doctorId : patientId,
        receiverId,
        message: newMessage.trim(),
        timestamp: new Date().toISOString()
      }]);

      setNewMessage('');
      scrollToBottom();
      if (onMessageSent) onMessageSent();
    } catch (error) {
      console.error('Error sending message:', error);
      if (error.message.includes('Unauthorized')) {
        alert('Session expired. Please log in again.');
      } else {
        alert('Failed to send message. Please try again.');
      }
    } finally {
      setSending(false);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await fetchWithAuth(`/api/Chat?MessageId=${messageId}`, {
        method: 'DELETE'
      });

      // Remove message from local state
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message. Please try again.');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col bg-white shadow-xl rounded-lg overflow-hidden">
      {/* Chat Header */}
      <div className="p-3 border-b flex items-center justify-between bg-indigo-600">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <span className="text-indigo-600 font-semibold text-base">
              {isDoctor ? (patientName ? patientName[0] : 'P') : 'D'}
            </span>
          </div>
          <h2 className="text-base font-semibold text-white">
            {isDoctor ? patientName : 'Doctor'}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-indigo-700 rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-red-500 text-center text-sm">
              <p>{error}</p>
              <button
                onClick={loadMessages}
                className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === (isDoctor ? doctorId : patientId) ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-lg p-2 relative group ${
                  message.senderId === (isDoctor ? doctorId : patientId)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="break-words text-sm">{message.message}</p>
                <p className={`text-[10px] mt-1 ${
                  message.senderId === (isDoctor ? doctorId : patientId)
                    ? 'text-indigo-200'
                    : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
                {message.senderId === (isDoctor ? doctorId : patientId) && (
                  <button
                    onClick={() => deleteMessage(message.id)}
                    className="absolute -right-5 top-0 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-2 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className={`px-3 py-1.5 bg-indigo-600 text-white rounded-lg ${
              sending || !newMessage.trim()
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-indigo-700'
            } transition-colors`}
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat; 