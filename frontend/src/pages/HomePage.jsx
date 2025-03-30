import React from 'react'
import { useChatStore } from '../store/useChatStore'
import EmptyChat from '../components/EmptyChat';
import Sidebar from '../components/Sidebar';
import ChatSection from '../components/ChatSection';

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className='h-screen bg-base-200'>
      <div className='flex items-center justify-center pt-16'>
        <div className='bg-base-200 rounded-lg shadow-xl w-full h-[calc(100vh-4rem)]'>
          <div className='flex h-full rounded-lg overflow-hidden'>
            <Sidebar />
            { selectedUser ? <ChatSection /> : <EmptyChat /> }
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
