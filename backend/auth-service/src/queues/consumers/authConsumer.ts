import { channel } from "../connection";
import User from "../../app/models/implements/User";
import { RabbitMQConfig } from "../../config/rabbitmq";
import { generatePassword } from "../../utils/generatePassword";
import { hashPassword } from "../../utils/hashUtils";
import { publishToQueue } from "../publisher";

export const consumeAuthData = async () => {
  try {
    if (!channel) {
      throw new Error("Channel is not  avilable");
    }

    //ensure the queue exist
    await channel.assertQueue(RabbitMQConfig.authConsumerQueue, {
      durable: true,
    });

    channel.consume(
      RabbitMQConfig.authConsumerQueue,
      async (message) => {
        if (message) {
          const authData = JSON.parse(message.content.toString());
          console.log("Received message from Company Service :", authData);

          const { email, role, authUserUUID } = authData;
          const getPassword = await generatePassword();
          const hashedPassword = await hashPassword(getPassword);

          const newUser = new User({
            email,
            role,
            authUserUUID,
            isFirstLogin: true,
            password: hashedPassword,
          });

          const result = await newUser.save();

          if (result) {
            console.log("User saved successfully in auth service", email);
            //data to send
            const notificationPayload = {
              type: "sendLoginDetails",
              email: email,
              password: getPassword,
              subject: `One time credentials for login`,
              message: `Welcome to the platform! Use the credentials below to log in. your email for login is : ${email} and one time password is ${getPassword}`,
              template: "employeeRegisterTemplate",
            };

            //publishing to notification queue
            publishToQueue(RabbitMQConfig.notificationQueue, notificationPayload);
          }

          channel?.ack(message);
        }
      },
      { noAck: false } //ensuring messages are acknoledged
    );
  } catch (error) {}
};
