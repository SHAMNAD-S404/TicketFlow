import User from "../../app/models/implements/User";
import { generatePassword } from "../../utils/generatePassword";
import { hashPassword } from "../../utils/hashUtils";
import { publishToQueue } from "../publisher";
import { RabbitMQConfig } from "../../config/rabbitmq";
import { AuthService } from "../../app/services/implementations/authService";
import { IAuthService } from "../../app/services/interface/IAuthService";
import { UserRepository } from "../../app/repositories/implements/userRepository";
import { IUserRepository } from "../../app/repositories/interface/IUserRepository";

const userRepo = new UserRepository();
const authService: IAuthService = new AuthService(userRepo);

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

// UDPATE THE USER SUBSCRIPTION END DATE
export const updateSubscriptionEndDate = async (data: IUpdateSubsData) => {
  try {
    const { companyEmail, subscriptionEndDate } = data;
    const updateUser = await authService.updateDocumentService({ email: companyEmail }, { subscriptionEndDate });
    console.log("user subscription got udpated ", updateUser);
  } catch (error) {
    console.error("❌ Error updating auth user data:", error);
  }
};
