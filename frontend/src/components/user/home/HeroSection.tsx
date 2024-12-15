import React from "react";
import heroImage from "../../../assets/images/hero-section.jpg";

const HeroSection: React.FC = () => {
  return (
    <section className="bg bg-gradient-to-r from-blue-50 to-blue-100 py-6">
      <div className="container mx-auto px-6 md:px-12 lg:flex lg:items-center lg:gap-12">
        {/* Left Content side*/}
        <div className="lg:w-1/2 w-full">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Stremline Communication with
            <span className="text-blue-600"> Our IT Ticketing System</span>
          </h1>
          <p className="mt-6 text-gray-600 text-lg">
            Our IT Ticketing System enhances inter-departmental collaboration by
            providing a seamless platform for reporting and resolving issues.
            With real-time updates, chat functionality, and comprehensive
            analytics, teams can work together more efficiently and effectively.
          </p>
          <div className="mt-8 flex space-x-4">
            <button className="bg-black text-white px-6  py-3 rounded-full shadow-md hover:bg-gray-600 transition">
              Learn More
            </button>
            <button className="border-2 border-black text-black px-6 py-3 rounded-full shadow-md hover:bg-blue-600 hover:text-white hover:border-blue-600 transition">
              Sign Up
            </button>
          </div>
        </div>

        {/*Right Content*/}
        <div className="lg:w-1/2 w-full flex justify-center mt-10 lg:mt-0">
          <img src={heroImage} alt="image" 
            className="max-w-full h-auto object-contain rounded-lg shadow-lg "
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
