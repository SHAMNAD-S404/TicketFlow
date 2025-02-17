import { toast } from "react-toastify";
import { Messages } from "../../enums/Messages";

export const searchInputValidate = (value: string): boolean => {
  try {
    const regexPattern: RegExp = /^[a-zA-Z]+([@.][a-zA-Z]+)*$/;
    const trimmedInput = value.trim();

    if (trimmedInput === "") return true;

    if (trimmedInput.length > 20) {
      toast.error(Messages.MAX_SIZE_REACHED_10);
      return false;
    }

    if (!regexPattern.test(trimmedInput)) {
      toast.error(Messages.VALID_SERCH_INPUT);
      return false;
    }

    return true;
  } catch (error) {
    console.log("search input validation failed : ", error);
    throw error;
  }
};
