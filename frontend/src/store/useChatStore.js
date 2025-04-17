import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set,get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,
  isMessageSending: false,

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      if(res.data.success) {
        set({ users: res.data.users });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Error in get users");
      console.log("error in get users:", error);
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      if(res.data.success) {
        set({ messages: res.data.messagesData });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Error in get messages");
      console.log("error in get messages:", error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    set({ isMessageSending: true });
    try {
      const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
      if(res.data.success) {
        set({ messages: [...messages, res.data.messageData] });
      } else {
        console.log(res.data.message);
      }
    } catch(error) {
      console.log("error in send message:", error);
    } finally {
      set({ isMessageSending: false });
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if(!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      set({ messages: [...get().messages, newMessage] });
    })
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => { set({ selectedUser })},
}));