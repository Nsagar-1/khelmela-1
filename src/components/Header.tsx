// src/components/Header.js
import React from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

function Header({ onDownloadClick }) {
  return (
    <header className="fixed w-full top-0 z-50 bg-black/40 backdrop-blur-md border-b border-[#ff00ff]/10">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00ffff]"
        >
          Khelmela
        </motion.h1>
        <div className="flex gap-6">
          <motion.button
            whileHover={{
              scale: 1.05,
              textShadow: "0 0 8px rgb(255, 0, 255)",
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-[#ff00ff] to-[#00ffff] px-6 py-2 rounded-lg font-medium text-black hover:shadow-[0_0_20px_rgba(255,0,255,0.5)] transition-shadow"
            onClick={onDownloadClick}
          >
            <Download className="inline-block mr-2 w-4 h-4" />
            Download Now
          </motion.button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
