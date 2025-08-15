// export default function App() {
//   return (
//     <div className="h-screen flex items-center justify-center bg-gray-900">
//       <h1 className="text-5xl font-bold text-blue-400">
//         ✅ Tailwind is Working!
//       </h1>
//     </div>
//   );
// }
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Loader2, Trash2, X } from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Main App component
const App = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showBackground, setShowBackground] = useState(true);
    const messagesEndRef = useRef(null);

    // This function scrolls the message area to the bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Scroll to the bottom whenever a new message is added
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle sending a message to the Gemini API
    const handleSendMessage = async () => {
        if (input.trim() === '') return;

        const userMessage = { role: 'user', content: input };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInput('');
        setIsLoading(true);

        const chatHistory = messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));
        chatHistory.push({ role: 'user', parts: [{ text: input }] });

        const apiUrl = 'https://genai-chatbot-project.onrender.com';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: chatHistory })
            });

            if (!response.ok) {
                throw new Error(`API call failed with status: ${response.status}`);
            }

            const result = await response.json();
            const botResponse = result.message;

            if (botResponse) {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { role: 'bot', content: botResponse }
                ]);
            } else {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { role: 'bot', content: 'Sorry, I could not generate a response.' }
                ]);
            }
        } catch (error) {
            console.error('Error calling the chatbot backend:', error);
            setMessages(prevMessages => [
                ...prevMessages,
                { role: 'bot', content: 'An error occurred. Please try again.' }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle key press for sending messages with Enter key
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSendMessage();
        }
    };

    const handleClearChat = () => {
        setMessages([]);
    };

    // A simple message component for displaying chat bubbles
    const Message = ({ role, content }) => {
        const isUser = role === 'user';
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={cn(
                    'flex items-start gap-3 mb-4',
                    isUser ? 'justify-end' : ''
                )}
            >
                {!isUser && (
                    <motion.div
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <Bot className="h-4 w-4" />
                    </motion.div>
                )}
                <div className={cn(
                    'max-w-[70%] md:max-w-md p-4 rounded-3xl',
                    isUser
                        ? 'bg-blue-600 text-white rounded-br-lg'
                        : 'bg-white text-gray-800 rounded-bl-lg shadow-sm'
                )}>
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>
                {isUser && (
                    <motion.div
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-white shadow-lg"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <User className="h-4 w-4" />
                    </motion.div>
                )}
            </motion.div>
        );
    };

    return (
        <div className="relative min-h-screen bg-white font-sans antialiased text-gray-800 overflow-hidden">
            <AnimatePresence>
                {showBackground && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 z-0 opacity-20"
                        style={{
                            backgroundImage: `url(https://placehold.co/1920x1080/E0E7FF/3B82F6?text=)`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="absolute inset-0 bg-white opacity-60"></div>
                        <div className="absolute inset-0 flex flex-wrap justify-center items-center pointer-events-none">
                            <motion.div
                                className="absolute top-[10%] left-[5%] w-24 h-24 bg-pink-400 rounded-full blur-3xl opacity-70 animate-pulse"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 5 }}
                            ></motion.div>
                            <motion.div
                                className="absolute bottom-[20%] right-[15%] w-32 h-32 bg-yellow-400 rounded-full blur-3xl opacity-70 animate-pulse"
                                animate={{ y: [0, 15, 0] }}
                                transition={{ repeat: Infinity, duration: 6, delay: 1 }}
                            ></motion.div>
                            <motion.div
                                className="absolute top-[30%] right-[30%] w-20 h-20 bg-green-400 rounded-full blur-3xl opacity-70 animate-pulse"
                                animate={{ x: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 4, delay: 2 }}
                            ></motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6">
                <div className="w-full max-w-2xl bg-slate-50/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col">
                    <header className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            <span className="text-blue-600">GenAi ChatBot</span>
                            {/* <br/>
                            <span className="text-sm font-normal text-gray-500">Customer support virtual assistant</span> */}
                        </h1>
                        <div className="flex gap-2">
                             <button
                                className="p-2 rounded-full bg-slate-200 text-gray-600 hover:bg-slate-300 transition-colors"
                                onClick={handleClearChat}
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                            <button
                                className="p-2 rounded-full bg-slate-200 text-gray-600 hover:bg-slate-300 transition-colors"
                                onClick={() => setShowBackground(!showBackground)}
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </header>
                    
                    <main className="flex-1 overflow-hidden">
                        <div className="h-[60vh] overflow-y-auto mb-6 p-4 rounded-xl bg-slate-100">
                            <AnimatePresence>
                                {messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                                        <Bot size={64} className="mb-4 text-blue-500" />
                                        <p className="text-xl">Hello! I'm your GenAI assistant. How can I help you today?</p>
                                    </div>
                                ) : (
                                    messages.map((msg, index) => (
                                        <Message key={index} role={msg.role} content={msg.content} />
                                    ))
                                )}
                            </AnimatePresence>
                            <div ref={messagesEndRef} />
                            <AnimatePresence>
                                {isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex justify-start mb-4"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
                                                <Bot className="h-4 w-4" />
                                            </div>
                                            <div className="max-w-xs md:max-w-md p-4 rounded-3xl bg-white text-gray-800 rounded-bl-lg shadow-sm flex items-center">
                                                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                                                <span className="ml-2 text-sm text-gray-500">Thinking...</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </main>
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message here..."
                            className="flex-1 h-12 rounded-full border border-gray-300 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSendMessage}
                            className="rounded-full h-12 w-12 bg-blue-600 text-white flex items-center justify-center disabled:bg-blue-300 transition-colors hover:bg-blue-700"
                            disabled={isLoading}
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
