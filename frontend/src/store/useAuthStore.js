import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set)=>({
  authUser: null,
  isSigningUp: false,
  isLoggingIng: false,
  idUpdatingProfile: false,
  selectedImg: null,
  onlineUsers: [],

  theme: localStorage.getItem("theme") || "light",
  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    set({theme});
  },

  isCheckingAuth: true,
  
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    set({ selectedImg: data.profileImg });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      if(res.data.success) {
        set({authUser: res.data.user});
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.message + "\n Please try photo size >5mb.");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      if(res.data.success) {
        set({authUser: res.data.user});
      }
    } catch(err) {
      set({authUser: null});
      console.log(err);
    } finally {
      set({isCheckingAuth: false});
    }
  },

  signUp: async (data) => {
    set({isSigningUp: true});
    try {
      const res = await axiosInstance.post('/auth/signup', data);
      console.log(res);
      if(res.data.success) {
        set({ authUser: res.data.user });
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch(err) {
      toast.error(err.response.data.message);
      console.log(err);
    } finally {
      set({isSigningUp: false});
    }
  },

  login: async (data) => {
    set({isLoggingIng: true});
    try {
      const res = await axiosInstance.post('/auth/login', data);
      if(res.data.success) {
        set({ authUser: res.data.user });
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch(err) {
      toast.error(err.response.data.message);
      console.log(err);
    } finally {
      set({isLoggingIng: false});
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post('/auth/logout');
      set({authUser: null});
      toast.success(res.data.message);
    } catch(err) {
      toast.error(err.response.data.message);
      console.log(err);
    }
  }
}))