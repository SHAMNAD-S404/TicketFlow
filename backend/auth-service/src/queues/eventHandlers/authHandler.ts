import User from "../../app/models/implements/User";
import { generatePassword } from "../../utils/generatePassword";
import { hashPassword } from "../../utils/hashUtils";
import { publishToQueue } from "../publisher";
import { RabbitMQConfig } from "../../config/rabbitmq";

export interface IUpdateSubsData {
  eventType: string;
  companyEmail: string;
  subscriptionEndDate: string;
}

export const createAuthUserHandler = async (data: any) => {
  try {
    const { email, role, authUserUUID } = data.userData;

    const plainPassword = await generatePassword();
    const hashedPassword = await hashPassword(plainPassword);

    const newUser = new User({
      email,
      role,
      authUserUUID,
      isFirstLogin: true,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    if (savedUser) {
      console.log("✅ Auth user created:", email);

      const notificationPayload = {
        type: "sendLoginDetails",
        email,
        password: plainPassword,
        subject: `One-time credentials for login`,
        message: `Welcome to the platform! Use the credentials below to log in. Email: ${email}, Password: ${plainPassword}`,
        template: "employeeRegisterTemplate",
      };

      await publishToQueue(RabbitMQConfig.notificationQueue, notificationPayload);
    }
  } catch (error) {
    console.error("❌ Error creating auth user:", error);
  }
};
