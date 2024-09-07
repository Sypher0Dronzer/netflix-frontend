import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   proxy: {
  //     // String shorthand for simple use-cases
  //     "/api": { target: "https://netflix-backend-6kdl.onrender.com",
  //       changeOrigin: true,
  //       secure: false,
  //      },
      
  //   },
  // },
});
