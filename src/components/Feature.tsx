// src/components/Features.js
import React from "react";
import { motion } from "framer-motion";
import { UserPlus, MessageSquare, Swords, Gift } from "lucide-react";
import { useInView } from "react-intersection-observer";

function Features() {
  const { ref: featuresRef, inView: featuresInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: <UserPlus className="w-12 h-12" />,
      title: "Create Your Team",
      description: "Build and customize your dream team for tournaments",
    },
    {
      icon: <MessageSquare className="w-12 h-12" />,
      title: "Team Chat",
      description: "Real-time chat with your teammates",
    },
    {
      icon: <Swords className="w-12 h-12" />,
      title: "Team Matches",
      description: "Invite your team to participate in matches",
    },
    {
      icon: <Gift className="w-12 h-12" />,
      title: "Weekly Rewards",
      description: "Exclusive rewards for weekly and monthly campaigns",
    },
  ];

  return (
    <section ref={featuresRef} className="relative py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={featuresInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2 }}
              className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-[#ff00ff]/10 hover:border-[#ff00ff]/30 hover:shadow-[0_0_30px_rgba(255,0,255,0.1)] transition-all"
            >
              <div className="mb-4 text-[#ff00ff]">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Features;
