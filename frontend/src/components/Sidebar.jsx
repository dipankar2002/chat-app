import React, { useEffect, useState } from 'react'
import { useChatStore } from '../store/useChatStore';
import SidebarSkeleton from './skeletons/SidebarSkeleton';
import { Users } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers, theme } = useAuthStore();
  const [ showOnlineOnly, setShowOnlineOnly ] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers])

  const filteredUsers = showOnlineOnly ? users.filter(user => onlineUsers.includes(user._id)) : users;

  if(isUsersLoading) return <SidebarSkeleton />

  return (
    <aside className='h-full w-full sm:w-20 md:w-72 border-r border-base-300 flex flex-col transition-all duration-200'>
      <div className='border-b border-base-300 flex sm:block items-center w-full px-2 py-5 md:px-5'>
        <div className='flex items-center gap-2'>
          <Users className='size-6 mx-0 sm:mx-auto md:mx-0'/>
          <span className='font-medium block sm:hidden md:block'>Contacts</span>
        </div>
        <div className="sm:mt-3 w-full mx-4 sm:mx-0 flex justify-between sm:block md:flex md:justify-start items-center gap-2 text-left sm:text-center md:text-left">
          <button 
            onClick={()=>setShowOnlineOnly((val)=>!val)}
            className={`
                text-sm font-bold rounded-md px-2 py-1 
                ${theme === "dark" ? 
                  `${showOnlineOnly ? "opacity-100 text-green-300 bg-green-950" : "opacity-50 text-white bg-gray-800"}`
                   : 
                  `${showOnlineOnly ? "opacity-100 text-green-800 bg-green-200" : "opacity-50 text-white bg-gray-800"}`
                }
                transition-colors duration-200 cursor-pointer`}
          >Online</button>
          <br />
          <span className="text-xs px-1 lg:px-0 text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
      </div>
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              border-y border-[1px] border-base-content/10
              w-full py-3 px-5 sm:p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-0 sm:mx-auto md:mx-0">
              <img
                src={user.profileImg || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="sm:hidden md:block text-left min-w-0">
              <div className="font-medium truncate">{user.name}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
