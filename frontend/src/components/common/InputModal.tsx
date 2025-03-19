import React from "react";
import { useForm } from "react-hook-form";
import Tooltips from "../utility/Tooltips";
import regexPatterns, { RegexMessages } from "@/utils/regexPattern";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


interface IInputModal {
  isOpen: boolean;
  onClose: () => void;
  submitSolution: (data: string) => void;
}

interface IFormValue {
  resolutions: string;
}

const InputModal: React.FC<IInputModal> = ({ isOpen, onClose, submitSolution }) => {
  //react hook forms props 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormValue>();

  //to send data back to the parent
  const handleSubmitResolution = (data: IFormValue) => {
    submitSolution(data.resolutions);
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[725px]   ">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Ticket resolutions</DialogTitle>
            <DialogDescription className="text-center font-semibold text-blue-500">
              Update the resolutions you provided on the ticket to resolve.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleSubmitResolution)}>
            <div className="flex flex-col justify-center ms-8">
              <div className="flex items-center gap-2">
                <label className="text-lg ms-2">Enter the updates</label>
                <Tooltips message="Numbers,alphabates,and this sybols only allowed [@,.,',-,_,]" />
              </div>
              <textarea
                className="bg-black/80 w-5/6 p-6 text-white font-mono rounded-lg h-64"
                placeholder="enter the resolutions your  provide."
                {...register("resolutions", {
                  required: RegexMessages.FEILD_REQUIRED,
                  minLength: {
                    value: 8,
                    message: RegexMessages.MINIMUM_LIMIT,
                  },
                  maxLength: {
                    value: 100,
                    message: RegexMessages.MAXIMUM_LIMIT_REACHED,
                  },
                  pattern: {
                    value: regexPatterns.resolutionInputField,
                    message: RegexMessages.text_area_validation,
                  },
                })}></textarea>
              {errors.resolutions && (
                <p className="text-red-500 text-sm font-semibold mt-2 ms-2">* {errors.resolutions.message}</p>
              )}
            </div>
            <div className="flex items-center justify-center mt-2">
            <button
            type="submit"
            className="bg-blue-500 w-1/4 text-white p-2 rounded-lg hover:bg-green-500 font-semibold text-sm hover:text-black">Save changes</button>
            </div>

          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InputModal;
