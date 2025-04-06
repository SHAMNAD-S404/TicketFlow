import { fetchOneTicket } from "@/api/services/ticketService";
import getErrMssg from "@/components/utility/getErrMssg";
import { ITicketDocument } from "@/interfaces/ITicketDocument";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface IUseTicketDataResult {
  ticketData: ITicketDocument | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useTicketData = (ticketId: string): IUseTicketDataResult => {
  const [ticketData, setTicketData] = useState<ITicketDocument | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTicketData = async () => {
    try {
      setLoading(true);
      const response = await fetchOneTicket(ticketId);
      if (response.success) {
        setTicketData(response.data);
        setError(null);
      }
    } catch (error: any) {
      toast.error(getErrMssg(error));
      setError(getErrMssg(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) {
      fetchTicketData();
    }
  }, [ticketId]);

  return { ticketData, loading, error, refetch: fetchTicketData };
};

export default useTicketData;
