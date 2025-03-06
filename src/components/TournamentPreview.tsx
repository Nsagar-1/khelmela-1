import React from "react";
import { motion } from "framer-motion";

function TournamentPreview({ image }) {
  return (
    <section className="relative py-10 px-4 w-full">
      <div className="flex justify-center">
        <img
          src={image}
          alt="Tournament"
          className="w-full md:w-[60%] lg:w-[40%] h-auto object-cover rounded-lg"
        />
      </div>
    </section>
  );
}

export default TournamentPreview;
