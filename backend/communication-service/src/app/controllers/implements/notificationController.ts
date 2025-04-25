import { Request, Response } from "express";
import { INotificationService } from "../../services/interface/INotificationService";
import { INotificationController } from "../interface/INotificationController";
import { HttpStatus } from "../../constants/httpStatus";
import { Messages } from "../../constants/messageConstants";
import { sendUserNotification } from "../../../socket";


export class NotificationController implements INotificationController {

    private readonly notificatoinService : INotificationService;

    constructor(NotificationService : INotificationService){
        this.notificatoinService = NotificationService;
    }

    public getNotifications = async(req: Request, res: Response): Promise<void> => {
     try {
        const userId = req.params.userId;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

        const [notificaiton,unreadCount] = await Promise.all([
            this.notificatoinService.getNotifications(userId,limit),
            this.notificatoinService.getUnreadCount(userId),
        ]);

        res.status(HttpStatus.OK)
        .json({message:Messages.DATA_FETCHED,
            success : true,
            data : {notificaiton,unreadCount}
        });
        
     } catch (error) {
        console.log(Messages.ERROR_WHILE,"getNotification" , error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({message : Messages.SERVER_ERROR,success:false});
     }   
    };


    public markAsRead = async (req: Request, res: Response): Promise<void> => {
        try {
            const notificaitonId = req.params.id;
            const updatedNotification = await this.notificatoinService.markAsRead(notificaitonId);

            if(!updatedNotification){
                res.status(HttpStatus.BAD_REQUEST)
                .json({message : Messages.DATA_NOT_FOUND,success:false});
                return;
            }

            res.status(HttpStatus.OK)
            .json({message : Messages.NOTIFICATION_UPDATED,
                success : true,
                data : updatedNotification,
            })
        } catch (error) {
            console.log(Messages.ERROR_WHILE,"mark as Read" , error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({message : Messages.SERVER_ERROR,success:false});
        }
    }


    public markAllAsRead = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.params.userId;
            await this.notificatoinService.markAllAsRead(userId);

            res.status(HttpStatus.OK)
            .json({message : Messages.NOTIFICATION_UPDATED,success : true})
        } catch (error) {
            console.log(Messages.ERROR_WHILE,"mark all read" , error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({message : Messages.SERVER_ERROR,success:false});
        }
    }


    public createNotifiation = async (req: Request, res: Response): Promise<void> => {
        try {

            const {  recipient, type, title, message, relatedId   } = req.body;
            
            //create and send notificattion
            const notificaiton = await sendUserNotification (recipient,{
                type,
                title,
                message,
                relatedId
            });

            res.status(HttpStatus.OK)
            .json({message:Messages.NOTIFICATION_CREATED,
                success : true,
                data  :notificaiton
            })
            
        } catch (error) {
            console.log(Messages.ERROR_WHILE,"create notificattion" , error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({message : Messages.SERVER_ERROR,success:false});
        }
    }
}