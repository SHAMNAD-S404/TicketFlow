import React from "react";
import PricingCard from "./PricingCard";

const pricingData = {
  silver: {
    title: "6 Months Silver Plan",
    price: 5999,
    period: "6 months",
    features: [
      { text: "Basic Analytics Dashboard" },
      { text: "5GB Cloud Storage" },
      { text: "All feature can access" },
    ],
  },
  premium: {
    title: "24 months Pro Plan",
    price: 15999,
    period: "24 months",
    features: [
      { text: "All feature can access" },
      { text: "25GB Cloud Storage" },
      { text: "Beta Features also can access" },
    ],
    isPopular: true,
  },
  gold: {
    title: "12 Months Gold Plan",
    price: 10999,
    period: "12 months",
    features: [
      { text: "All feature can access" },
      { text: "10GB Cloud Storage" },
      { text: "fast support and services" },
    ],
  },
};

const PricingTable: React.FC = () => {
  return (
    <div className=" bg-gray-50 px-4 py-6 rounded-lg">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="mb-1 font-bold text-black sm:text-5xl md:text-4xl">Choose a Best Plan for your organisation</h2>
        <p className="mx-auto mb-8 max-w-2xl  text-gray-600">
          TicketFlow is evolving to be more than just an IT Ticketing System. It supports the entire organization and
          its employees in managing and improving their work."
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          <PricingCard {...pricingData.silver} />
          <PricingCard {...pricingData.premium} buttonVariant="primary" />
          <PricingCard {...pricingData.gold} />
        </div>
      </div>
    </div>
  );
};

export default PricingTable;
