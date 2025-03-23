import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set)=>({
  authUser: null,
  isSigningUp: false,
  isLoggingIng: false,
  idUpdatingProfile: false,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({authUser: res.data});
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
      set({ authUser: res.data.user });
      if(res.data.success) {
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
      set({ authUser: res.data.user });
      if(res.data.success) {
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