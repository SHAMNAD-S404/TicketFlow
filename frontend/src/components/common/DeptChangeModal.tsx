import React, { useEffect, useState } from "react";
import { changeEmployeeDepartment, fetchAllDepartemts } from "@/api/services/companyService";
import { toast } from "react-toastify";
import getErrMssg from "../utility/getErrMssg";
import { Messages } from "@/enums/Messages";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";


interface IDeptChangeModal {
  isModalOpen: boolean;
  employeeId: string;
  currentDepartment: string;
  onModalClose: () => void;
  twickParent: () => void;
}

interface Departement {
  _id: string;
  departmentName: string;
}

const DeptChangeModal: React.FC<IDeptChangeModal> = ({
  isModalOpen,
  twickParent,
  onModalClose,
  employeeId,
  currentDepartment,
}) => {
  //component states
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [allDepartments, setAllDepartments] = useState<Departement[]>([]);

  //departement selection function
  const handleSelectionChange = (departmentId: string) => {
    setSelectedDepartmentId(departmentId);
    setIsVisible(true);
  };

  //handle department update
  const hanldeDepartmentChange = async () => {
    if (!selectedDepartmentId) {
      toast.warn(Messages.SELECT_A_DEPT);
      return;
    }
    if (!employeeId) {
      toast.warn(Messages.EMPLOYEE_ID_MISSING);
      return;
    }

    //to get the selected department full details
    const departmentDetails = allDepartments.find((dept) => dept._id === selectedDepartmentId);

    try {
      //api call
      const response = await changeEmployeeDepartment(
        employeeId,
        selectedDepartmentId,
        departmentDetails?.departmentName as string
      );

      if (response.success) {
        toast.success(response.message);
        twickParent();
        onModalClose();
      }
    } catch (error: any) {
      toast.error(getErrMssg(error));
    }
  };

  useEffect(() => {
    const getAllDepartments = async () => {
      try {
        const response = await fetchAllDepartemts();
        if (response?.data) {
          setAllDepartments(response.data);
        }
      } catch (error: any) {
        toast.error(getErrMssg(error));
      }
    };

    getAllDepartments();
  }, []);

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onModalClose}>
        <DialogOverlay className="bg-transparent" />
        <DialogContent onInteractOutside={(e) => e.preventDefault()} className="sm:max-w-m md:max-w-[500px] ">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Change Department</DialogTitle>
            <DialogDescription className="text-center text-black">
              select the departement to change employee departement
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center  items-center  gap-8">
            <select
              value={selectedDepartmentId}
              onChange={(e) => handleSelectionChange(e.target.value)}
              className="px-4 rounded-xl py-2 bg-gray-200 outline-none shadow-lg border border-gray-200 ">
              <option value="" disabled>
                {currentDepartment}
              </option>
              {allDepartments
                .filter((dept) => dept.departmentName !== currentDepartment)
                .map((department, index) => (
                  <option key={index} value={department._id}>
                    {department.departmentName}
                  </option>
                ))}
            </select>

            {isVisible && (
              <button
                className="bg-black hover:bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-semibold  "
                onClick={hanldeDepartmentChange}>
                Submit
              </button>
            )}
          </div>
          <DialogFooter className="sm:justify-center">
            <DialogClose asChild>
              <button className="text-white hover:bg-black text-sm font-semibold bg-red-500 px-8 rounded-lg py-1 mt-4 ">
                Close
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeptChangeModal;
