import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { IoInformationCircleSharp } from "react-icons/io5";

import React from "react";

interface TooltipsProps {
  message: string;
}

const Tooltips: React.FC<TooltipsProps> = ({ message }) => {
  return (
    <div>
      <IoInformationCircleSharp
        data-tooltip-id="company-name-tooltip"
        data-tooltip-content={message}
        className="hover:text-blue-600 flex "
      />
      <Tooltip id="company-name-tooltip" />
    </div>
  );
};

export default Tooltips;
