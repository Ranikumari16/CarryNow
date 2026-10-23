import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am CarryNow Assistant. How can I help you with your parcel today?' }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    const newMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(newMessages);
    setInputMsg('');

    // Smart Bot Reply Logic
    setTimeout(() => {
      const msg = userText.toLowerCase();
      let replyText = "Thanks for your message! Our CarryNow support team will get back to you shortly.";

      if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
        replyText = "Hello! Welcome to CarryNow. How can I help you deliver your personal belongings today?";
      } else if (msg.includes("price") || msg.includes("cost") || msg.includes("charge")) {
        replyText = "Delivery charges start at ₹80 for local deliveries and ₹300 for intercity. You can check exact rates on the Book Parcel page!";
      } else if (msg.includes("track") || msg.includes("status")) {
        replyText = "You can track your order live by entering your Order ID (e.g. CN######) on the Track Order page.";
      } else if (msg.includes("time") || msg.includes("fast") || msg.includes("urgent")) {
        replyText = "Local campus and city deliveries are completed within 1 to 3 hours.";
      } else if (msg.includes("contact") || msg.includes("phone")||msg.includes("email")) {
        replyText = "You can reach CarryNow support at support@carrynowservice.in or call +91 960880XXXX.";
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: replyText }]);
    }, 500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center gap-2 group"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-sm font-semibold pr-1">
            Need Help?
          </span>
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 sm:w-96 h-[450px] flex flex-col overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-5">
          <div className="bg-slate-900 text-white p-4 flex justify-between items-center border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">CarryNow Bot</h3>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online Support
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1 transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && (
                  <div className="bg-indigo-100 p-1.5 rounded-full text-indigo-600 mb-1 flex-shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className={`max-w-[75%] p-3 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                  msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
                {msg.sender === 'user' && (
                  <div className="bg-slate-200 p-1.5 rounded-full text-slate-600 mb-1 flex-shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl transition flex items-center justify-center">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;