import React from "react";

export interface DynamicCardProps {
  image: string;
  header: string;
  description?: string;
  buttonText: string;
  onButtonClick?: () => void;
}

const DynamicCard: React.FC<DynamicCardProps> = ({
  image,
  header,
  description,
  buttonText,
  onButtonClick,
}) => {
  return (
    <div className="group relative w-full max-w-sm h-[24rem] rounded-2xl shadow-2xl shadow-black overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
      {/* Background Image  */}
      <div
        className="absolute inset-0 bg-cover bg-blue-300 bg-center transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80 group-hover:from-black/50 group-hover:via-black/60 group-hover:to-black/90 transition-colors duration-300" />

      {/* Card Content */}
      <div className="relative h-full p-6 flex flex-col justify-between">
        {/* Header Section */}
        <div className="space-y-4 transform transition-transform duration-300 group-hover:-translate-y-2">
          <h2 className="text-2xl font-sans font-bold text-white  text-center tracking-wide">
            {header}
          </h2>
          {description && (
            <p className="text-lg font-inter text-yellow-400 font-medium text-center leading-relaxed opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
              {description}
            </p>
          )}
        </div>

        {/* Button Section */}
        <div className=" flex justify-center transform transition-all duration-300 group-hover:translate-y-0 translate-y-2">
          <button
            onClick={onButtonClick}
            className="relative w-56  bg-gray-100 text-gray-900 font-semibold py-2 px-6 rounded-xl shadow-xl 
              transition-all duration-300 
              hover:bg-gradient-to-r from-yellow-400 to-red-500 hover:shadow-lg hover:shadow-white/20
              active:scale-[0.98]
              font-outfit tracking-wide
              before:absolute before:inset-0 before:rounded-lg before:bg-white/0 before:transition-colors
              hover:before:bg-white/10 z-10"
          >
            {buttonText}
          </button>

          {/* Bottom Gradient */}
          <div className="absolute -bottom-2 inset-x-0 h-8 bg-gradient-to-t from-black/90 to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default DynamicCard;
