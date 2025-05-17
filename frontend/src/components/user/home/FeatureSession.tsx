import React from "react";
import FeatureCard from "./FeatureCard";
import { ImTicket } from "react-icons/im";
import { TbLiveViewFilled } from "react-icons/tb";
import { IoMdChatbubbles } from "react-icons/io";
import { FaFileVideo, FaUsers } from "react-icons/fa";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";
import { motion } from "framer-motion";
import { staggerContainer, fadeUpVariant } from "../../animations/variants";

const features = [
  {
    icon: <ImTicket />,
    title: "Efficient Ticket Management Made Simple",
    description: "Easily create, assign, and track tickets across departments.",
  },
  {
    icon: <TbLiveViewFilled />,
    title: "Live Status Tracking for Every Ticket",
    description: "Stay informed with real-time updates on ticket progress.",
  },
  {
    icon: <IoMdChatbubbles />,
    title: "Integrated Chat for Seamless Communication",
    description: "Chat in real-time with team members directly within the app.",
  },
  {
    icon: <FaFileVideo />,
    title: "Video Calls for Seamless Communication",
    description: "Video call in real-time with team members directly within the app.",
  },
  {
    icon: <TbDeviceDesktopAnalytics />,
    title: "Advanced Analytics and Insights",
    description: "Get detailed insights and analytics to improve performance.",
  },
  {
    icon: <FaUsers />,
    title: "Role-Based Access Control",
    description: "Assign roles and permissions to maintain data security and controller over the applicaton",
  },
];

const FeatureSession: React.FC = () => {
  return (
    <motion.section
      className="bg-blue-100 py-12 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={fadeUpVariant}>
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div className="text-center mb-12" variants={fadeUpVariant} custom={0}>
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            Explore Our Innovative Ticketing Feature
          </motion.h2>
          <motion.p
            className="text-gray-600 md:text-lg font-medium"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}>
            Our IT Ticketing System is designed to streamline communication between departments. With real-time updates
            and efficient ticket management,
            <br /> your team can resolve issues faster than ever.
          </motion.p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}>
          {features.map((feature, index) => (
            <motion.div key={index} variants={fadeUpVariant} custom={index * 0.1}>
              <FeatureCard icon={feature.icon} title={feature.title} description={feature.description} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeatureSession;
