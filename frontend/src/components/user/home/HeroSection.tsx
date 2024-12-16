import React from "react";


interface HeroSectionProps {
    heading:string;
    text: string;
    image : string;
    reverse? : boolean
}

const HeroSection: React.FC<HeroSectionProps> = ({
    heading,
    text,
    image,
    reverse = false,
}) => {
  return (
    <section className="bg bg-gradient-to-r from-blue-50 to-blue-100 py-6">
      <div 
        className= {`container mx-auto px-6 md:px-12 lg:flex lg:items-center lg:gap-12  ${
        reverse ? "lg:flex-row-reverse" : ""
        }`}>

        {/* Text section*/}
        <div className="lg:w-1/2 w-full">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 leading-tight">
            {heading}
          </h1>
          <p className="mt-6 text-gray-600 phone:text-sm md:text-lg"> {text} </p>
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
          <img src={image} alt="image" 
            className="max-w-full h-auto object-contain  "
          />
        </div>
      </div>
    </section>
    
  );
};

export default HeroSection;
