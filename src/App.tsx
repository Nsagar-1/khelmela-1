// src/App.js
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Hero from "./components/Hero";
import Features from "./components/Feature";
import Header from "./components/Header";
import TeamPreview from "./components/TeamPreview";
import TournamentPreview from "./components/TournamentPreview";

import image1 from "./assets/images/dahboard.png"; // Assuming image1 is in the assets/images folder
import image2 from "./assets/images/Cs.png";
import image3 from "./assets/images/chat.png";
import image4 from "./assets/images/interface.png";
import image5 from "./assets/images/Champions.png";

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [platform, setPlatform] = useState("android");

  const handleDownloadClick = () => {
    setShowPopup(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2865&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#2a0a2a] opacity-90"></div>

      <Header onDownloadClick={handleDownloadClick} />
      <Hero
        onStartPlayingClick={handleDownloadClick}
        onViewTournamentsClick={handleDownloadClick}
      />
      <Features />
      <TeamPreview />
      <h2 className="text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00ffff] text-center">
        App Preview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  place-items-center">
        <TournamentPreview image={image1} />
        <TournamentPreview image={image2} />
        <TournamentPreview image={image3} />
        <TournamentPreview image={image4} />
        <TournamentPreview image={image5} />
      </div>

      {/* Download Popup */}
      <AnimatePresence>
        {showPopup && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowPopup(false)}
          >
            <div
              className="bg-[#1a1a1a] p-8 rounded-xl max-w-md mx-4 relative border border-[#ff00ff]/20"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Platform Toggle */}
              <div className="flex justify-center mb-6 bg-black/40 rounded-lg p-1">
                <button
                  className={`px-6 py-2 rounded-md transition-all ${
                    platform === "android"
                      ? "bg-gradient-to-r from-[#ff00ff] to-[#00ffff] text-black font-medium"
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setPlatform("android")}
                >
                  Android
                </button>
                <button
                  className={`px-6 py-2 rounded-md transition-all ${
                    platform === "ios"
                      ? "bg-gradient-to-r from-[#ff00ff] to-[#00ffff] text-black font-medium"
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setPlatform("ios")}
                >
                  iOS
                </button>
              </div>

              <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00ffff]">
                Coming Soon!
              </h3>
              <p className="text-gray-300 mb-6">
                Hang on tight! Our {platform === "android" ? "Android" : "iOS"}{" "}
                app will be available soon. Sign up to get notified when we
                launch!
              </p>
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-black/40 border border-[#ff00ff]/20 focus:outline-none focus:border-[#ff00ff]/50"
                />
                <button className="px-6 py-2 bg-gradient-to-r from-[#ff00ff] to-[#00ffff] rounded-lg font-medium text-black hover:shadow-[0_0_20px_rgba(255,0,255,0.5)] transition-shadow">
                  Notify Me
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
