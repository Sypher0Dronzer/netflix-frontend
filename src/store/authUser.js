import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isSigningUp: false,
  isCheckingAuth: true,
  isLoggingOut: true,
  isLoggingIn: false,
  signup: async (credentials) => {
    set({ isSigningUp: true });
    try {
      const response = await axios.post("https://netflix-backend-6kdl.onrender.com/api/v1/auth/signup", credentials,{
        withCredentials: true,});

      toast.success("Account created successfully");
      set({ user: response.data.user, isSigningUp: false });
    } catch (err) {
      toast.error(err.response.data.message || "Signup failed");
      set({ isSigningUp: false, user: null });
    }
  },

  login: async (credentials) => {
    set({ isLoggingIn: true });
    try {
      const response = await axios.post("https://netflix-backend-6kdl.onrender.com/api/v1/auth/login", credentials,{
        withCredentials: true,});

      toast.success("Logged In successfully");
      set({ user: response.data.user, isLoggingIn: false });
    } catch (err) {
      console.log(err.message)
      toast.error(err.response.data.message || "LogIn failed");
      set({ isLoggingIn: false, user: null });
    }
  },

  logout: async () => {
    try {
      await axios.post("https://netflix-backend-6kdl.onrender.com/api/v1/auth/logout",{
        withCredentials: true,});
      set({ user: null, isLoggingOut: false });
      toast.success("Logged out successfully");
    } catch (err) {
      // console.log(err.message);
      toast.error(err.response.data.message || "Logout failed");
      set({ isLoggingOut: false });
    }
  },

  authCheck: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axios.get("https://netflix-backend-6kdl.onrender.com/api/v1/auth/authcheck",{
        withCredentials: true,});

      set({ user: response.data.user, isCheckingAuth: false });
    } catch (err) {
      console.log(err.message);

      set({ isCheckingAuth: false, user: null });
    }
  },
}));
