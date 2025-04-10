import React, { useState } from "react";
import { FaRegKeyboard } from "react-icons/fa6";
import { BsInfoCircleFill } from "react-icons/bs";
import { useForm } from "react-hook-form";
import regexPatterns, { RegexMessages } from "@/utils/regexPattern";
import getErrMssg from "../utility/getErrMssg";
import { toast } from "react-toastify";
import { changePassword } from "@/api/services/authService";
import { FaRegEye, FaEyeSlash } from "react-icons/fa";

interface IChangePassword {
    userEmail: string;
}

export interface changePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword: React.FC<IChangePassword> = ({ userEmail }) => {
  //component states
  const [passVisible1, setPasswordVisible1] = useState<boolean>(false);
  const [passVisible2, setPasswordVisible2] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<changePasswordFormData>();

  //watch password for matching with confirm password
  const passwordWatch = watch("newPassword");

  //password change fn
  const submitPasswordChange = async (data: changePasswordFormData) => {
    const payload = { ...data, email: userEmail };
    try {
      const response = await changePassword(payload);
      if (response.success) {
        reset();
        toast.success(response.message);
      }
    } catch (error: any) {
      toast.error(getErrMssg(error));
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(submitPasswordChange)}>
        <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <FaRegKeyboard className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex items-center gap-2">
              <input
                type={passVisible1 ? "text" : "password"}
                className="bg-blue-100 rounded-xl py-2 text-center "
                placeholder="Enter current password"
                {...register("currentPassword", {
                  required: RegexMessages.FEILD_REQUIRED,
                  minLength: {
                    value: 8,
                    message: RegexMessages.MINIMUM_LIMIT,
                  },
                  maxLength: {
                    value: 15,
                    message: RegexMessages.MAXIMUM_LIMIT_REACHED,
                  },
                })}
              />
              <button onClick={() => setPasswordVisible1(!passVisible1)}>
                {passVisible1 ? <FaRegEye className="text-lg" /> : <FaEyeSlash className="text-lg" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm font-semibold text-red-500">{errors.currentPassword.message}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <FaRegKeyboard className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex items-center gap-2">
              <input
                type={passVisible2 ? "text" : "password"}
                className="bg-blue-100 rounded-xl py-2 text-center "
                placeholder="Enter new password"
                {...register("newPassword", {
                  required: RegexMessages.FEILD_REQUIRED,
                  minLength: {
                    value: 8,
                    message: RegexMessages.MINIMUM_LIMIT,
                  },
                  maxLength: {
                    value: 15,
                    message: RegexMessages.MAXIMUM_LIMIT_REACHED,
                  },
                  pattern: {
                    value: regexPatterns.newPasswordValidation,
                    message: RegexMessages.newPassValidationMssg,
                  },
                })}
              />

              <button onClick={() => setPasswordVisible2(!passVisible2)}>
                {passVisible2 ? <FaRegEye className="text-lg" /> : <FaEyeSlash className="text-lg" />}
              </button>
            </div>
            {errors.newPassword && <p className="text-sm font-semibold text-red-500">{errors.newPassword.message}</p>}
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <BsInfoCircleFill className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm">Password: 8-15 chars, alphanumeric & special chars required</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <FaRegKeyboard className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex items-center gap-2">
              <input
                type={passVisible2 ? "text" : "password"}
                className="bg-blue-100 rounded-xl py-2 text-center "
                placeholder="Enter confirm password"
                {...register("confirmPassword", {
                  required: RegexMessages.FEILD_REQUIRED,
                  validate: (value) => value === passwordWatch || "Password do not mathing!",
                })}
              />

              <button onClick={() => setPasswordVisible2(!passVisible2)}>
                {passVisible2 ? <FaRegEye className="text-lg" /> : <FaEyeSlash className="text-lg" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm font-semibold text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>
        <div className="flex justify-center text-center mt-8 gap-4">
          <button
            className="bg-black px-28 py-2  text-white text-sm font-semibold rounded-xl hover:bg-blue-500 "
            type="submit">
            submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
