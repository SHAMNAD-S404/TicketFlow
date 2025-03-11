import { sendEmail } from "../utils/sendEmail";

export const messageHandlers: Record<string, (payload: any) => Promise<void>> = {

  registration: async ({ email, subject, template, otp, content }) => {
    await sendEmail(email, subject, template, { otp, content });
  },

  sendLoginDetails: async ({ email, subject, template, password, content }) => {
    await sendEmail(email, subject, template, { email, password, content });
  },

  "change-password-link": async ({ email, subject, template, resetLink }) => {
    await sendEmail(email, subject, template, {
      resetLink,
      email,
      supportUrl: "TicketFlow support team",
    });
  },

  ticketAssigned : async ({  email , subject,template ,ticketId,employeeName}) => {
    await sendEmail(email,subject,template,{ticketId,employeeName})
  }


};

export const processMessage = async (type: string, payload: any): Promise<void> => {
  const handler = messageHandlers[type];
  if (!handler) {
    console.error("❌ Unknown notification type:", type);
    throw new Error(`❌ Unknown notification type:${type}`);
  }

  try {
    await handler(payload);
  } catch (error) {
    console.error("Error in processing message", error);
  }
};
