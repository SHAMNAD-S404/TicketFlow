import { BaseRepo } from "./BaseRepository";
import NotificationModel from "../../models/implements/NotificationSchema";
import { INotification } from "../../models/interface/INotification";
import { INotificationRepo } from "../interface/INotificationRepo";

export default class NotificationRepo extends BaseRepo<INotification> implements INotificationRepo {
  constructor() {
    super(NotificationModel);
  }

  async findNotifications(
    searchQuery: Record<string, any>,
    limit: number
  ): Promise<INotification[]> {
    return await NotificationModel.find(searchQuery).sort({ createdAt: -1 }).limit(limit);
  }
}
