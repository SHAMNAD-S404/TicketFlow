import { sendEmail } from "../utils/sendEmail";

export const messageHandlers: Record<string, (payload: any) => Promise<void>> = {

  // REGISTRATION EMAIL 
  registration: async ({ email, subject, template, otp, content }) => {
    await sendEmail(email, subject, template, { otp, content });
  },

  // WELCOME EMAIL WITH ONE LOGIN DETAILS
  sendLoginDetails: async ({ email, subject, template, password, content }) => {
    await sendEmail(email, subject, template, { email, password, content });
  },

  // CHANGE PASSWORD EMAIL LINK
  "change-password-link": async ({ email, subject, template, resetLink }) => {
    await sendEmail(email, subject, template, {
      resetLink,
      email,
      supportUrl: "TicketFlow support team",
    });
  },

  // TICKET ASSIGN EMAIL
  ticketAssigned: async ({ email, subject, template, ticketId, employeeName, priority }) => {
    await sendEmail(email, subject, template, { ticketId, employeeName, priority });
  },

  // TICKET CLOSED EMAIL
  ticketClosed: async ({
    email,
    subject,
    template,
    ticketId,
    employeeName,
    closedDate,
    resolutionTime,
  }) => {
    await sendEmail(email, subject, template, {
      ticketId,
      employeeName,
      closedDate,
      resolutionTime,
    });
  },
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
