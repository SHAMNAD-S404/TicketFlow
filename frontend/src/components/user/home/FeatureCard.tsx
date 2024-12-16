import React from "react";

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="flex flex-col items-start p-6 bg-white shadow-lg rounded-lg 
    hover:bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:text-white 
     hover:rotate-6 hover:scale-105 transition-transform  duration-300">
      <div className="text-blue-500 text-3xl mb-4">{icon}</div>
      <h3 className="phone:text-sm  md:text-lg font-semibold mb-2">{title}</h3>
      <p className= "phone:text-sm sm:text-lg hover:font-medium text-gray-700">{description}</p>
    </div>
  );
};

export default FeatureCard;
