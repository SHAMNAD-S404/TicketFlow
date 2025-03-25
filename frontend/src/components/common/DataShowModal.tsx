import React from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface IDataShowModal {
  isOpen: boolean;
  onClose: () => void;
  data: string;
}

const DataShowModal: React.FC<IDataShowModal> = ({ isOpen, onClose, data }) => {
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="sm:max-w-[425px] md:max-w-[525px] bg-blue-50"
          onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="text-center underline underline-offset-2">Ticket Re-Open Reason</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col justify-center ms-2 ">
            <textarea className="bg-black/80 w-full p-6 text-white font-mono rounded-lg h-64 " readOnly>
              {data}
            </textarea>
          </div>
          <div className="flex items-center justify-center mt-2">
            <button
              onClick={onClose}
              className="bg-blue-500 w-1/4 text-white p-2 rounded-lg hover:bg-green-500 font-semibold text-sm hover:text-black">
              Ok
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataShowModal;
