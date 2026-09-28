import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
export default defineConfig({ plugins:[react(),tailwindcss()], resolve:{alias:{"@":path.resolve(__dirname,"src")}}, server:{host:"0.0.0.0",port:5173,strictPort:true}, build:{rollupOptions:{output:{manualChunks:{map:["leaflet","react-leaflet"],charts:["recharts"],query:["@tanstack/react-query","axios"],react:["react","react-dom","react-router-dom"]}}}} });
