import React from "react";
import FeatureCard from "./FeatureCard";
import { ImTicket } from "react-icons/im";
import { TbLiveViewFilled } from "react-icons/tb";
import { IoMdChatbubbles } from "react-icons/io";
import { FaFileVideo, FaUsers } from "react-icons/fa";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";

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
    title: "Integrated Video Calls for Seamless Communication",
    description:
      "Video call in real-time with team members directly within the app.",
  },
  {
    icon: <TbDeviceDesktopAnalytics />,
    title: "Advanced Analytics and Insights",
    description: "Get detailed insights and analytics to improve performance.",
  },
  {
    icon: <FaUsers />,
    title: "Role-Based Access Control",
    description: "Assign roles and permissions to maintain data security.",
  },
];

const FeatureSession: React.FC = () => {
  return (
    <section className="bg-blue-100 py-12">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Explore Our Innovative Ticketing Feature
          </h2>
          <p className="text-gray-600 md:text-lg font-medium shado">
            Our IT Ticketing System is designed to streamline communication
            between departments. With real-time updates and efficient ticket
            management,
            <br /> your team can resolve issues faster than ever.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
export default FeatureSession;
