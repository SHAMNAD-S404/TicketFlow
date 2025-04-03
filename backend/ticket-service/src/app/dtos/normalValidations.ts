import { HttpStatus } from "../../constants/httpStatus";
import { Messages } from "../../constants/messageConstants";

interface IupdateTicketValidationReturn {
  success: boolean;
  statusCode?: number;
  message?: string;
}

const updateTicketValidation = (
  id: string,
  status: string,
  ticketResolutions: string
): IupdateTicketValidationReturn => {
  if (!id || !status) {
    return {
      success: false,
      statusCode: HttpStatus.BAD_REQUEST,
      message: Messages.REQUIRED_FIELD_MISSING,
    };
  }
  const ticketStatus: string[] = ["pending", "in-progress", "resolved", "re-opened"];
  if (!ticketStatus.includes(status)) {
    return {
      success: false,
      statusCode: HttpStatus.BAD_REQUEST,
      message: Messages.ENTER_VALID_INPUT,
    };
  }
  if (status === "resolved" && !ticketResolutions) {
    return {
      success: false,
      message: "Ticket resolution not provided",
      statusCode: HttpStatus.BAD_REQUEST,
    };
  }
  const resolutionInputField: RegExp = /^[a-zA-Z0-9.,'"\:(\)\s-]+$/;

  if (ticketResolutions && !resolutionInputField.test(ticketResolutions)) {
    return {
      success: false,
      statusCode: HttpStatus.BAD_REQUEST,
      message: Messages.ENTER_VALID_INPUT,
    };
  }

  return {
    success: true,
  };
};

export default updateTicketValidation;
