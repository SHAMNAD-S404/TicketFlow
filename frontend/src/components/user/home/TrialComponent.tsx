import React from "react";

const TrialComponent: React.FC = () => {
  return (
    <section className="bg-blue-100 py-8 px-6 lg:px-16 flex flex-col lg:flex-row items-center justify-between gap-6">
      {/* Left Text Section */}
      <div className="w-full lg:w-1/2 text-center ">
        <h2 className="text-2xl bg-gradient-to-r from-purple-600 via-green-500 to-blue-700 bg-clip-text text-transparent
            lg:text-5xl font-bold sm:mb-4  hover:bg-gradient-to-r hover:from-yellow-500 hover:via-red-500 hover:to-pink-500
            hover:text-transparent hoer:bg-clip-text transition duration-300 ">
          Start your free trial today
        </h2>
      </div>

      {/* Button Section */}
      <div className="w-full lg:w-1/2  flex-col gap-4">
        <p className=" phone:text-base sm:text-lg text-gray-700">
          Experience seamless communication between departments with our IT
          Ticketing System. Sign up now for a free 7-day trial and streamline
          your organization's ticket management.
        </p>
        <div className="flex  justify-center gap-3 py-4">
          <button className="bg-black text-white  py-2 px-6 rounded-md hover:bg-blue-700 transition duration-300">
            Sign Up
          </button>
          <button className="bg-transparent border-2 border-black text-black py-2 px-6 rounded-md hover:bg-black hover:text-white transition ">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrialComponent;
