import React, { useEffect, useState } from "react";
import { FaPencil } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import regexPatterns, { RegexMessages } from "@/utils/regexPattern";
import { deleteDepartment, updateDepartmentInfo } from "@/api/services/companyService";
import getErrMssg from "../utility/getErrMssg";
import { MdDeleteForever } from "react-icons/md";
import { showCustomeAlert } from "../utility/swalAlertHelper";
import { Messages } from "@/enums/Messages";
import Swal from "sweetalert2";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

//interface for props
export interface DepartmentCardProps {
  _id: string;
  image: string;
  header: string;
  description: string;
  handleView: () => void;
  twickParent: () => void;
  setDepartmentName : () => void;
}

//interface for formData
interface IDepartmentData {
  id: string;
  departmentName: string;
  responsibilities: string;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({
  _id,
  image,
  header,
  description,
  twickParent,
  handleView,
  setDepartmentName
}) => {
  const [departmentData, setDepartmentData] = useState<IDepartmentData>({
    id: _id,
    departmentName: header,
    responsibilities: description,
  });
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Partial<IDepartmentData>>();

  const handleViewSubmission = () => {
    setDepartmentName();
    handleView();
  }

  const onSubmitData = async (data: Partial<IDepartmentData>) => {
    try {
      data.id = _id;
      const response = await updateDepartmentInfo(data);
      if (response.success) {
        setDepartmentData(response.data);
        toast.success(response.message);
        setModalOpen(false);
      }
    } catch (error) {
      toast.error(getErrMssg(error));
    }
  };

  //handle delete department fn
  const handleDeleteDepartment = async (id: string, name: string) => {
    if (!id) return toast.error(Messages.SOMETHING_TRY_AGAIN);

    const result = await showCustomeAlert({
      title: "Are you sure ?",
      text: `Did you want to delete ${name}?  Make sure employees of this department are managed accordingly.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes,Proceed",
      cancelButtonText: "No, Cancel",
      reverseButtons: true,
    });
    try {
      if (result.isConfirmed) {
        const response = await deleteDepartment(id);
        if (response.success) {
          twickParent();
          toast.success(response.message);
        }
      }
    } catch (error) {
      Swal.fire({
        text: getErrMssg(error),
        icon: "error",
      });
    }
  };

  useEffect(() => {
    setDepartmentData({
      id: _id,
      departmentName: header,
      responsibilities: description,
    });
  }, [_id, header, description]);

  return (
    <div className="group relative w-full max-w-sm h-[20rem] rounded-2xl shadow-2xl shadow-black overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
      {/* Background Image  */}
      <div
        className="absolute inset-0 bg-cover bg-blue-300 bg-center transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80 group-hover:from-black/50 group-hover:via-black/60 group-hover:to-black/90 transition-colors duration-300" />

      {/* Card Content */}
      <body></body>
      <div className="relative h-full p-6 flex flex-col justify-between">
        {/* Header Section */}
        <div className="space-y-4 transform transition-transform duration-300 group-hover:-translate-y-2">
          <div className="flex justify-around items-center gap-2">
            <h2 className="text-2xl font-sans font-bold text-white  text-center tracking-wide">
              {departmentData.departmentName}
            </h2>

            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <button className=" bg-white p-2  text-xl rounded-xl hover:shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-125  ">
                  <FaPencil className="text-black  hover:text-blue-600" />
                </button>
              </DialogTrigger>
              <DialogContent
                className="sm:max-w-[600px] sm:max-h-[400px] text-white bg-black border border-gray-600 "
                onInteractOutside={(e) => e.preventDefault()}>
                <form onSubmit={handleSubmit(onSubmitData)}>
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl   ">Edit Department</DialogTitle>
                    <DialogDescription className=" text-white text-center mt-2  font-semibold ">
                      Make changes to your profile here. Click save when you're done !
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-12">
                    <div className="phone:flex phone:flex-col  md:grid grid-cols-4 items-center gap-2">
                      <label htmlFor="name" className=" font-medium text-lg">
                        Name
                      </label>
                      <input
                        id="name"
                        className="col-span-3 shadow-lg shadow-gray-400 rounded-lg p-2 font-mono text-black focus:outline-blue-400 "
                        defaultValue={departmentData.departmentName}
                        {...register("departmentName", {
                          required: "This field is required",
                          maxLength: {
                            value: 20,
                            message: RegexMessages.MAXIMUM_LIMIT_REACHED,
                          },
                          minLength: {
                            value: 4,
                            message: RegexMessages.MINIMUM_LIMIT,
                          },
                          pattern: {
                            value: regexPatterns.name,
                            message: RegexMessages.nameRegexMessage,
                          },
                        })}
                      />
                    </div>
                    {errors.departmentName && (
                      <p className="text-sm font-medium text-red-600 text-center ms-16">
                        {errors.departmentName.message}
                      </p>
                    )}

                    <div className="phone:flex phone:flex-col  md:grid grid-cols-4 items-center gap-4">
                      <label htmlFor="username" className="  font-medium text-lg  ">
                        Responsibilities
                      </label>
                      <textarea
                        id="responsibilities"
                        className="col-span-3 shadow-lg shadow-gray-400 rounded-lg p-4 focus:outline-blue-400 text-black font-medium "
                        defaultValue={departmentData.responsibilities}
                        {...register("responsibilities", {
                          required: RegexMessages.FEILD_REQUIRED,
                          maxLength: {
                            value: 100,
                            message: RegexMessages.MAXIMUM_LIMIT_REACHED,
                          },
                          minLength: {
                            value: 5,
                            message: RegexMessages.MINIMUM_LIMIT,
                          },
                          pattern: {
                            value: regexPatterns.textWithSpaceAndCommas,
                            message: RegexMessages.textWithSpaceAndCommasRegexMessage,
                          },
                        })}
                      />
                    </div>
                    {errors.responsibilities && (
                      <p className=" text-center  text-sm text-red-600 font-medium">
                        {errors.responsibilities.message}
                      </p>
                    )}
                  </div>
                  <DialogFooter>
                    <DialogClose>
                      <p className="bg-red-600 p-2 rounded-xl text-sm px-6 font-semibold hover:bg-green-500">close</p>
                    </DialogClose>
                    <button
                      type="submit"
                      className="  bg-blue-500 text-white p-2 px-4 rounded-2xl text-sm font-semibold hover:bg-green-600 hover:text-white ">
                      Save changes
                    </button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {/* delete session */}
            <div
              className="bg-white rounded-lg cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-125 hover:text-red-600 "
              onClick={() => handleDeleteDepartment(_id, header)}>
              <MdDeleteForever className="text-3xl  " />
            </div>
          </div>
          {description && (
            <p className="text-lg font-inter text-yellow-400 font-medium text-center leading-relaxed opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
              {departmentData.responsibilities}
            </p>
          )}
        </div>

        {/* Button Section */}
        <div className=" flex justify-center transform transition-all duration-300 group-hover:translate-y-0 translate-y-2">
          <button
            onClick={handleViewSubmission}
            className="relative w-56  bg-gray-100 text-gray-900 font-semibold py-2 px-6 rounded-xl shadow-xl 
              transition-all duration-300 
              hover:bg-gradient-to-r from-yellow-400 to-red-500 hover:shadow-lg hover:shadow-white/20
              active:scale-[0.98]
              font-outfit tracking-wide
              before:absolute before:inset-0 before:rounded-lg before:bg-white/0 before:transition-colors
              hover:before:bg-white/10 z-10">
            view
          </button>

          {/* Bottom Gradient */}
          <div className="absolute -bottom-2 inset-x-0 h-8 bg-gradient-to-t from-black/90 to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default DepartmentCard;
