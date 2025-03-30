import React, { useEffect, useState } from 'react'
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessagesSkeleton from './skeletons/MessagesSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utils';

const ChatSection = () => {
  const { selectedUser, messages, getMessages, isMessagesLoading } = useChatStore();
  const { authUser } = useAuthStore();
  const [ activeImg, setActiveImg ] = useState(null);

  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser, getMessages])
  

  if(isMessagesLoading) {
    return (
      <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader />
        <MessagesSkeleton />
        <MessageInput />
      </div>
    )
  }

  const handleImageClick = (image) => {
    setActiveImg(activeImg === image ? null : image);
  };

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      <div className='relative flex-1 overflow-y-auto p-4 space-y-4' style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            
          >
            {!activeImg ? (
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
            ) : null}
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col text-md">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className={`cursor-pointer transition-all duration-300 ${
                    activeImg === message.image ? "max-w-[600px] sm:max-w-[700px]" : "max-w-[100px] sm:max-w-[200px]"
                  } rounded-md mb-2`}
                  onClick={() => handleImageClick(message.image)}
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  )
}

export default ChatSection
