import { Messages } from "@/enums/Messages";

function getErrMssg(error : any){
    return error.response?.data?.message || Messages.SOMETHING_TRY_AGAIN
}

export default getErrMssg;