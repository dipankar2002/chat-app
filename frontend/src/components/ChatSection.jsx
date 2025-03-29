import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessagesSkeleton from './skeletons/MessagesSkeleton';

const ChatSection = () => {
  const { selectedUser, messages, getMessages, isMessagesLoading } = useChatStore();

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

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      <p>Messages..</p>
      <MessageInput />
    </div>
  )
}

export default ChatSection
