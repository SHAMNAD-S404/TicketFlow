import React from "react";
import { Skeleton } from "../ui/skeleton";

interface IRowsSkelton {
  lengthNo: number;
}

export const RowsSkelton: React.FC<IRowsSkelton> = ({ lengthNo = 5 }) => {
  return (
    <>
      <div className="space-y-8 mt-8 px-6">
        {Array.from({ length: lengthNo }).map((_, index) => (
          <Skeleton
            key={index}
            className=" h-4 py-10 bg-white shadow-lg shadow-gray-400 rounded-xl bg-gradient-to-br from-gray-100 to-gray-300"
          />
        ))}
      </div>
    </>
  );
};
