import React, { useState } from "react";
import DynamicCard from "../../../utility/DynamicCard";
import CardImage from "../../../../assets/images/black.png";
import CardImage2 from "../../../../assets/images/black.png";
import CreateDepartment from "../subMenu/CreateDepartment";
import { SubDepartmentManagement } from "../subMenu/SubDepartmentManagement";

const DepartmentManagement: React.FC = () => {
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

  const handleActiveSubMenu = () => {
    setActiveSubMenu(null);
  };

  const renderSubContent = () => {
    switch (activeSubMenu) {
      case "Add Department":
        return <CreateDepartment setActiveSubMenu={handleActiveSubMenu} />;
      case "Manage Department":
        return <SubDepartmentManagement />;

      default:
        return (
          <div className="flex flex-wrap gap-12 justify-center p-6">
            <DynamicCard
              header="Add Departments"
              description="Add your departement and details for efficient management."
              buttonText="Register"
              onButtonClick={() => setActiveSubMenu("Add Department")}
              image={CardImage}
            />

            <DynamicCard
              header="Departments management"
              description="View and manage departments and their details"
              buttonText="Manage"
              onButtonClick={() => setActiveSubMenu("Manage Department")}
              image={CardImage2}
            />
          </div>
        );
    }
  };

  return <div>{renderSubContent()}</div>;
};

export default DepartmentManagement;
