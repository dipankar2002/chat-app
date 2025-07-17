import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utils';

const now = new Date();
const isoTime = now.toISOString();

const PREVIEW_MESSAGES = [
    { id: 1, content: "Hey! How's it going?", isSent: false, createdAt: "2025-04-22T07:36:30.304+00:00" },
    { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true, createdAt: "2025-04-22T07:36:50.127+00:00" },
  ];


const SettingPage = () => {
  const { theme, setTheme } = useAuthStore();
  const [ text, setText ] = useState('');
  const messageEndRef = useRef(null);

  const [messages, setMessages] = useState(PREVIEW_MESSAGES);

  useEffect(() => {
    if(messageEndRef.current && messages) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages])

  function setMessText() {
    const newMessage = {
      id: Date.now(), // Unique ID
      content: text,
      isSent: true,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
    setText(''); // clear input
  }

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Theme</h2>
            <p className="text-sm text-base-content/70">Choose a theme for your chat interface</p>
          </div>
          <div className='w-30 flex justify-between'>
            <button 
              className={`${theme==="light"?"opacity-40":""} bg-primary/10 text-primary font-bold px-2 py-1 rounded-md`}
              onClick={() => setTheme("light")}
            >Light</button>
            <button 
              className={`${theme==="dark"?"opacity-40":""} bg-primary/10 text-primary font-bold px-2 py-1 rounded-md`}
              onClick={() => setTheme("dark")}
            >Dark</button>
          </div>
        </div>

        {/* Preview Section */}
        <h3 className="text-lg font-semibold mb-3">Preview</h3>
        <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
          <div className="p-4 bg-base-200">
            <div className="max-w-lg mx-auto">
              {/* Mock Chat UI */}
              <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#605DFF]/20 flex items-center justify-center text-base-content font-medium">
                      J
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">John Doe</h3>
                      <p className="text-xs text-base-content/70">Online</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`chat ${message.isSent ? "chat-end" : "chat-start"}`}
                    >
                      <div className="chat-header mb-1">
                        <time className="text-xs opacity-50 ml-1">
                          {formatMessageTime(message.createdAt)}
                        </time>
                      </div>
                      <div className={`chat-bubble p-0 ${message.isSent ? "bg-[#605DFF]/20" : ""} flex flex-col text-md`}>
                        <p className='px-2 py-1'>{message.content}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messageEndRef}></div>
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-base-300 bg-base-100">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      className="w-full input rounded-lg input-md"
                      placeholder="Type a message..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                    {text && (
                      <button
                        className="btn btn-md btn-circle bg-[#605DFF]/20"
                        onClick={() => setMessText()}
                        disabled={!text.trim()}
                      >
                        <Send size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingPage
