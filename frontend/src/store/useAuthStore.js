import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

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
  }
}))