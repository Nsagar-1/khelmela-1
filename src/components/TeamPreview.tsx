// src/components/TeamPreview.js
import React from "react";
import { motion } from "framer-motion";
import image_gamer from "../assets/images/gamer.jpg";
import gamer2 from "../assets/images/gamer3.webp";

function TeamPreview() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00ffff]">
          Team Up & Dominate
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff00ff] to-[#00ffff] rounded-xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
            <img
              src={image_gamer}
              alt="Team Playing"
              className="w-full h-[400px] object-cover rounded-xl"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff00ff] to-[#00ffff] rounded-xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
            <img
              src={gamer2}
              alt="Team Chat"
              className="w-full h-[400px] object-cover rounded-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default TeamPreview;
