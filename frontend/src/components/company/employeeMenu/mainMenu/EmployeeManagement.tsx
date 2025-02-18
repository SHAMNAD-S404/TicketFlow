import React, { useState } from "react";
import DynamicCard from "../../../utility/DynamicCard";
import CardImage from "../../../../assets/images/register.png";
import CardImage2 from "../../../../assets/images/userlogin.png";
import EmployeeRegistration from "../subMenu/EmployeeRegistration";
import AllEmployeeManagement from "../subMenu/AllEmployeeManagement";

const EmployeeManagement: React.FC = () => {
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

  const onCancel = () => setActiveSubMenu(null);

  const renderSubContent = () => {   
    switch (activeSubMenu) {
      case "Employee Registration":
        return <EmployeeRegistration handleCancel={onCancel} />;
      case "Manage Employees" :
        return <AllEmployeeManagement handleCancel = {onCancel} />;
      default:
        return (
          <div className="flex flex-wrap gap-12 justify-center p-6">
            <DynamicCard
              header="Employee Registration"
              description="Register employees and manage their details easily."
              buttonText="Register"
              onButtonClick={() => setActiveSubMenu("Employee Registration")}
              image={CardImage}
            />

            <DynamicCard
              header="Manage Employees"
              description="Manage employees and theire details"
              buttonText="Manage"
              onButtonClick={() => setActiveSubMenu("Manage Employees")}
              image={CardImage2}
            />
          </div>
        );
    }
  };

  return <div>{renderSubContent()}</div>;
};

export default EmployeeManagement;
