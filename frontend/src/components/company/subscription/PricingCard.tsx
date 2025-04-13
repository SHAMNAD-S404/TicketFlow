import React from "react";
import { Check } from "lucide-react";
import { BiCrown } from "react-icons/bi";

interface PricingFeature {
  text: string;
}

interface PricingCardProps {
  title: string;
  price: number;
  period: string;
  features: PricingFeature[];
  isPopular?: boolean;
  buttonVariant?: "default" | "primary";
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  period,
  features,
  isPopular = false,
  buttonVariant = "default",
}) => {
  return (
    <div className="relative rounded-2xl border border-gray-800 bg-black p-8 shadow-lg">
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="rounded-full bg-pink-500 px-4 py-1 text-sm font-semibold text-white">Popular</div>
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <BiCrown className="text-3xl text-yellow-500" />

          {title}
        </h3>
        <div className="mt-4 flex items-baseline">
          <span className="text-4xl font-bold text-white">₹{price}</span>
          <span className="ml-1 text-gray-400">/ {period}</span>
        </div>
      </div>
      <ul className="mb-8 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-300">
            <Check className="mr-3 h-5 w-5 text-green-500" />
            <span>{feature.text}</span>
          </li>
        ))}
      </ul>
      <button
        className={`w-full rounded-lg py-3 text-center font-semibold transition-colors ${
          buttonVariant === "primary"
            ? "bg-white text-black hover:bg-yellow-500 "
            : "border border-gray-600 text-white hover:bg-white hover:text-black"
        }`}
        onClick={() => alert(title)}>
        Get Started
      </button>
    </div>
  );
};

export default PricingCard;
