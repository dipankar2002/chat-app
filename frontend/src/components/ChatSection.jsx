import React, { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessagesSkeleton from './skeletons/MessagesSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utils';
import { X } from 'lucide-react';

const ChatSection = () => {
  const { selectedUser, messages, getMessages, isMessagesLoading, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { authUser } = useAuthStore();
  const [ activeImg, setActiveImg ] = useState(null);
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }

    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages])
  
  useEffect(() => {
    if(messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages])

  useEffect(() => {
    document.body.style.overflow = activeImg ? "hidden" : "auto";
  }, [activeImg]);

  const handleImageClick = (image) => {
    setActiveImg(image);
  };

  if(isMessagesLoading) {
    return (
      <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader />
        <MessagesSkeleton />
        <MessageInput />
      </div>
    )
  }

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      <div className='relative flex-1 overflow-y-auto p-4 space-y-4' style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            {/* {!activeImg ? (
              <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profileImg || "/avatar.png"
                      : selectedUser.profileImg || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            ) : null} */}
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className={`chat-bubble p-0 ${message.senderId === authUser._id ? "bg-[#605DFF]/20" : ""} flex flex-col text-md`}>
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="cursor-pointer transition-all duration-300 px-1 pt-1 max-w-[150px] sm:max-w-[200px] rounded-md mb-2"
                  onClick={() => handleImageClick(message.image)}
                />
              )}
              {message.text && <p className='px-2 py-1'>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />

      {/* Fullscreen Image Viewer */}
      {activeImg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={() => setActiveImg(null)}
        >
          <button
            onClick={() => setActiveImg(null)}
            className="absolute top-5 right-5 text-white text-3xl hover:text-gray-300 z-50"
          >
            <X />
          </button>
          <img
            src={activeImg}
            alt="Full View"
            className="max-w-[95vw] max-h-[90vh] rounded-lg shadow-lg transition-all duration-300"
          />
        </div>
      )}
    </div>
  )
}

export default ChatSection
