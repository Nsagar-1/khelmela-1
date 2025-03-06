// src/components/Hero.js
import React from "react";
import { motion } from "framer-motion";

function Hero({ onStartPlayingClick, onViewTournamentsClick }) {
  return (
    <section className="relative pt-32 pb-20 px-4">
      <div className="container mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00ffff]"
        >
          Dominate The Arena
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto"
        >
          Join the ultimate esports platform. Compete in daily tournaments, win
          prizes, and become a legend.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            className="px-8 py-4 bg-gradient-to-r from-[#ff00ff] to-[#00ffff] rounded-lg font-bold text-lg text-black hover:shadow-[0_0_30px_rgba(255,0,255,0.5)] transition-shadow"
            onClick={onStartPlayingClick}
          >
            Start Playing Now
          </button>
          <button
            className="px-8 py-4 bg-white/5 rounded-lg font-bold text-lg border border-[#ff00ff]/30 hover:border-[#ff00ff] hover:shadow-[0_0_30px_rgba(255,0,255,0.2)] transition-all"
            onClick={onViewTournamentsClick}
          >
            View Tournaments
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
