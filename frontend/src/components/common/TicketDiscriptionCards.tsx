import React from "react";

interface ITicketDiscriptionCard {
  caption1: string;
  value1: string;
  caption2: string;
  value2: string;
  caption3: string;
  value3: string;
}

const TicketDiscriptionCard: React.FC<ITicketDiscriptionCard> = ({
  caption1,
  caption2,
  caption3,
  value1,
  value2,
  value3,
}) => {
  return (
    <div>
      <div className="mt-4  bg-white rounded-lg shadow-xl p-2 text-center ">
        <h1 className="font-semibold ">
          {caption1}
          <br />
          <span className="ms-1 font-semibold text-sm text-blue-600 font-mono">{value1}</span>{" "}
        </h1>
        <h1 className="font-semibold ">
          {caption2}
          <br />
          <span className="ms-1 font-semibold text-sm text-blue-600 font-mono">{value2}</span>{" "}
        </h1>
        <h1 className="font-semibold ">
          {caption3}
          <br />
          <span className="ms-1 font-semibold text-sm text-blue-600 font-mono">{value3}</span>{" "}
        </h1>
      </div>
    </div>
  );
};

export default TicketDiscriptionCard;
