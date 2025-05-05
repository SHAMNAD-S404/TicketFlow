import React from "react";
import { FaMedal } from "react-icons/fa";
import { CheckCircle2 } from "lucide-react";

interface LeaderCardProps {
  name?: string;
  imageUrl?: string;
  title: string;
  subTitle: string;
  ticketCount?: string;
  isLoading?: boolean;
  currentTime?: string;
  currentUser?: string;
}

const LeaderCard: React.FC<LeaderCardProps> = ({ 
  name, 
  imageUrl, 
  title,
  subTitle,
  ticketCount,
  isLoading = false,
}) => {
  // Check if there's no data
  const hasNoData = !name || !imageUrl || !ticketCount;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 sm:w-[400px] md:w-full h-full relative">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-6 w-2/3 bg-gray-200 animate-pulse rounded" />
          <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
          <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-6 w-1/3 bg-gray-200 animate-pulse rounded" />
          <div className="h-8 w-1/2 bg-gray-200 animate-pulse rounded-full" />
        </div>
      </div>
    );
  }

  if (hasNoData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 sm:w-[400px] md:w-full h-full relative">
        <div className="flex flex-col items-center">
          <h2 className="text-black text-lg font-semibold">{title}</h2>
          <p className="text-gray-500 text-sm mb-4">{subTitle}</p>
          
          <div className="flex flex-col items-center justify-center py-8">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <p className="text-lg font-medium text-gray-800">
              No Leader Data Available
            </p>
            <p className="text-sm text-gray-500 mt-1 text-center max-w-[250px]">
              There are currently no tickets assigned to determine the leader
            </p>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sm:w-[400px] md:w-full h-full relative">
      <div className="flex flex-col items-center">
        {/* Title */}
        <h2 className="text-black text-lg font-semibold">{title}</h2>
        <FaMedal className="text-xl" />
        <p className="text-gray-500 text-sm mb-2">{subTitle}</p>

        {/* Main Image Container */}
        <div className="relative">
          {/* Profile Image */}
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img 
              src={imageUrl} 
              alt={name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'fallback-image-url.jpg'; // Add a fallback image
              }}
            />
          </div>
          {/* Badge Icon */}
          <div className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          </div>
        </div>

        {/* Name and Title */}
        <h3 className="text-gray-800 text-xl font-semibold mt-4">{name}</h3>
        <div className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm mt-2">
          Total tickets: {ticketCount}
        </div>

        
      </div>
    </div>
  );
};

export default LeaderCard;