import React, { useEffect, useState } from "react";
import { IDepartement, IEmployeeList } from "@/components/common/TicketForm";
import { fetchAllDepartemts, fetchEmployeesByDepartment } from "@/api/services/companyService";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Messages } from "@/enums/Messages";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ticketReassign } from "@/api/services/ticketService";
import getErrMssg from "@/components/utility/getErrMssg";

interface IReassignTicketProps {
  selectedDepartmentId: string;
  selectedEmployeeId: string;
  selectedTicketId: string;
  handleCancel: () => void;
  twickParent: () => void;
}

export interface IUpdateReassignTicketData {
  ticketId: string;
  selectedDepartmentId: string;
  selectedDepartmentName: string;
  selectedEmployeeId: string;
  selectedEmployeeName: string;
  selectedEmployeeEmail: string;
}

export const ReassignTicket: React.FC<IReassignTicketProps> = ({
  selectedDepartmentId,
  selectedTicketId,
  selectedEmployeeId,
  handleCancel,
  twickParent,
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>(selectedDepartmentId);
  const [selectedEmployee, setSelectedEmployee] = useState<string>(selectedEmployeeId);
  const [allDepartment, setAllDepartment] = useState<IDepartement[]>([]);
  const [employees, setEmployees] = useState<IEmployeeList[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const handleSubmit = async () => {
    try {
      if (!selectedDepartment || employees.length === 0) {
        toast.error(Messages.SELECT_REQUIRED_FIELDS);
        return;
      }
      const departmentDetails = allDepartment.find((dept) => dept._id === selectedDepartment);
      const employeeDetails = employees.find((emp) => emp._id === selectedEmployee);
      const ticketReassignData: IUpdateReassignTicketData = {
        ticketId: selectedTicketId,
        selectedDepartmentId: selectedDepartment,
        selectedDepartmentName: departmentDetails?.departmentName as string,
        selectedEmployeeId: selectedEmployee,
        selectedEmployeeName: employeeDetails?.name as string,
        selectedEmployeeEmail: employeeDetails?.email as string,
      };

      const response = await ticketReassign(ticketReassignData);
      if (response.success) {
        toast.success(response.message);
        twickParent();
        setIsDrawerOpen(false);
      }
    } catch (error) {
      toast.error(getErrMssg(error));
    }
  };

  useEffect(() => {
    if (!selectedDepartment) {
      setEmployees([]);
      return;
    }
    const fetchEmployees = async () => {
      try {
        const response = await fetchEmployeesByDepartment(selectedDepartment);
        if (response.success) {
          setEmployees(response.data);
          // If the current selectedEmployee is not in the new employee list, update it
          const isEmployeeValid = response.data.some((emp: IEmployeeList) => emp._id === selectedEmployee);
          if (!isEmployeeValid && response.data.length > 0) {
            setSelectedEmployee(response.data[0]._id);
          }
        }
      } catch (error) {
        toast.error(getErrMssg(error))
      }
    };

    fetchEmployees();
  }, [selectedDepartment]);

  useEffect(() => {
    const fetchAllDepartmentsData = async () => {
      try {
        const response = await fetchAllDepartemts();
        if (response && response.data) {
          setAllDepartment(response.data);
        }
      } catch (error: any) {
        if (error.response && error.response.data) {
          Swal.fire({
            title: "oops",
            text: error.response.data.message,
            icon: "error",
          }).then((result) => {
            if (result.isConfirmed) {
              handleCancel();
            }
          });
        } else {
          toast.error(Messages.SOMETHING_TRY_AGAIN);
        }
      }
    };
    fetchAllDepartmentsData();
  }, []);

  return (
    <div>
      <div className="flex justify-center">
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <button className="bg-blue-500 p-1 rounded-2xl text-white text-sm w-2/4 hover:bg-red-600 shadow-xl shadow-gray-400 ">
              Reassign
            </button>
          </DrawerTrigger>
          <DrawerContent className="h-3/5  text-white ">
            <DrawerHeader>
              <DrawerTitle>
                <h2 className="text-center mt-2 text-2xl ">Reassign Ticket</h2>
              </DrawerTitle>
              <DrawerDescription>
                <p className="text-center text-white">Reassign the ticket to another employee or department</p>
              </DrawerDescription>
            </DrawerHeader>

            <div className="flex justify-center gap-16 mt-4">
              <div className="flex flex-col">
                <label htmlFor="ticketAssigned department">Select Department to assign ticket</label>
                <select
                  name="ticketHandlingDepartmentName"
                  className="mt-1 p-2 rounded-lg text-black "
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}>
                  {allDepartment.map((department, index) => (
                    <option value={department._id} key={index}>
                      {department.departmentName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="ticketAssigned department">Select employee to assign ticket</label>
                <select
                  name="ticketHandlingDepartmentName"
                  className="mt-1 p-2 rounded-lg text-black "
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}>
                  {employees.map((employee, index) => (
                    <option value={employee._id} key={index}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <DrawerFooter className="mb-20">
              <div className="text-center">
                <button
                  className="bg-blue-500 hover:bg-green-600 p-2 font-semibold rounded-xl w-1/5 "
                  onClick={handleSubmit}>
                  Submit
                </button>
              </div>
              <DrawerClose>
                <button className="bg-gray-100 hover:bg-red-600 hover:text-white  text-black p-2 font-semibold rounded-xl w-1/5 ">
                  cancel
                </button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};
