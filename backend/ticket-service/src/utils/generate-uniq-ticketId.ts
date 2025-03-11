import ticketRepository from "../app/repositories/implements/ticketRepository";

//to generate uniq ticket id
export const generateUniqTicketId = async () => {

  const helperFunction = () => {
    const random = Math.floor(10000 + Math.random() * 90000);
    return String(random);
  };

  let ticketId = helperFunction();

  while (await ticketRepository.findOneDocument({ ticketId })) {
    ticketId = helperFunction();
  }

  return ticketId;
};
