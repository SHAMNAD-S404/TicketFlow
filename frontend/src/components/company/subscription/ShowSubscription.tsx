import React from "react";
import { GiMoneyStack } from "react-icons/gi";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { useSelector } from "react-redux";
import { Rootstate } from "@/redux store/store";
import PricingTable from "./PricingTable";

const ShowSubscription: React.FC = () => {
  //redux store data
  const company = useSelector((state: Rootstate) => state.company.company);
  //to check its free tier plan or not
  const isFreeTierPlan: boolean = company?.subscriptionPlan === "Free Tier";
  
  
 
  return (
    <>
    <div className=" flex flex-col gap-2 bg-blue-50 rounded-lg">
      <header>
        <h1 className=" flex justify-center items-center gap-2 mt-2 text-2xl font-semibold underline  ">
          Subscription
          <GiMoneyStack className="text-green-600 text-3xl" />
          Management
        </h1>
        <div className="mt-4 shadow-2xl p-2 bg-white rounded-lg mx-8 h-1/4">
          <div className=" ms-4 flex items-center gap-2 justify-evenly p-2">
            <MdOutlineWorkspacePremium
              className={`text-8xl p-1 ${
                isFreeTierPlan ? "text-violet-600" : "text-yellow-400"
              } shadow-xl rounded-full  `}
            />
            <h1
              className="text-3xl  font-semibold bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500 text-transparent bg-clip-text
                         ">
              {company?.subscriptionPlan}
            </h1>
            <div className="flex flex-col gap-2">
              <h2 className="font-semibold underline underline-offset-2"> Subscription plan ends on </h2>
              <h1 className=" text-red-500 text-center font-semibold">{ company?.subscriptionEndDate }</h1>
            </div>
          </div>
          {/* <div className="overflow-hidden whitespace-nowrap mt-2">
            <h2 className="inline-block animate-marquee pause-on-hover text-center bg-gradient-to-l from-purple-500 via-orange-500 to-yellow-500 text-transparent bg-clip-text font-semibold text-sm">
              Purchase a subscription plan to continue or extend your subscription validity and access our app support
              and services. Thank you for choosing us!
            </h2>
          </div> */}
        </div>
      </header>
      <main>
        <div className="rounded-lg bg-gray-50 mx-8 p-2 shadow-2xl">
          <PricingTable />
        </div>
      </main>
      <footer>
      <div className="overflow-hidden whitespace-nowrap mt-2">
            <h2 className="inline-block animate-marquee pause-on-hover text-center bg-gradient-to-l from-purple-500 via-orange-500 to-yellow-500 text-transparent bg-clip-text font-semibold text-sm">
              Purchase a subscription plan to continue or extend your subscription validity and access our app support
              and services. Thank you for choosing us!
            </h2>
          </div>
      </footer>
    </div>
    </>
    
  );
};
export default ShowSubscription;
