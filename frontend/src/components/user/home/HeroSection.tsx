import React, { useEffect, useState } from "react";
import SignUpModal from "../../customUI/signUpModal";

interface HeroSectionProps {
  heading: string;
  text: string;
  image: string;
  reverse?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  heading,
  text,
  image,
  reverse = false,
}) => {
  //state to store displayed text for the type effect
  const [displayedText, setDisplayedText] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false); //signup modal

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[currentIndex]);
      currentIndex++;
      if (currentIndex === text.length - 1) clearInterval(interval);
    }, 20);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <section className="bg bg-gradient-to-r from-blue-50 to-blue-100 py-6">
      <div
        className={`container mx-auto px-6 md:px-12 lg:flex lg:items-center lg:gap-12  ${
          reverse ? "lg:flex-row-reverse" : ""
        }`}
      >
        {/* Text section*/}
        <div className="lg:w-1/2 w-full">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 leading-tight">
            {heading}
          </h1>
          <p className="mt-6 text-gray-600 phone:text-sm md:text-lg">
            {displayedText}
          </p>
          <div className="mt-8 flex space-x-4">
            <button className="bg-black text-white px-6  py-3 rounded-full shadow-md hover:bg-gray-600 transition">
              Learn More
            </button>
            <button 
               onClick={() => setShowModal(true)}
              className="border-2 border-black text-black px-6 py-3 rounded-full shadow-md hover:bg-blue-600 hover:text-white hover:border-none ">
              Sign Up
            </button>
          </div>
        </div>

        {/*Right Content*/}
        <div className="lg:w-1/2 w-full flex justify-center mt-10 lg:mt-0">
          <img
            src={image}
            alt="image"
            className="max-w-full h-auto object-contain  "
          />
        </div>
      </div>

                {/* Modal Component */}
      <SignUpModal isOpen={showModal} onClose={() => setShowModal(false)} />

    </section>
  );
};

export default HeroSection;
