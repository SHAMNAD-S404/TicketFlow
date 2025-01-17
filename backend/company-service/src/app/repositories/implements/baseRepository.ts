// import {Model , Document} from "mongoose";
// import { IBaseRepository } from "../interface/IBaseRepository";

// export class BaseRepository<T> implements IBaseRepository<T> {
//     private readonly model: Model<T>;

//     constructor(model: Model<T>) {
//         this.model = model;
//     }

//     async create(item: T):Promise<T> {
//         try {
//             const createDocument = new this.model(item);
//             return await createDocument.save() as T;
//         } catch (error) {
//             throw new Error("failed to create document");
//         }
//     }

//     async findOne(filter: Partial<T>): Promise<T | null> {
//         try {
//             return await this.model.findOne(filter);
//         } catch (error) {
//             throw new Error("failed to find document");
//         }

//     }

//     async findAll(): Promise<T[]> {
//         try {
//             return await this.model.find();
//         } catch (error) {
//             throw new Error("failed to find document");
//         }
//     }

//     async update(filter: Partial<T>, updates: Partial<T>): Promise<T | null> {
//         try {
//             return await this.model.findOneAndUpdate(filter,updates,{new:true}).exec()
            
//         } catch (error) {
//             throw new Error("failed to update document");
//         }
//     }

//     async findById(id: string): Promise<T | null> {
//         try {
//             return await this.model.findById(id).exec();
//         } catch (error) {
//             throw new Error("failed to find document by id");
//         }
//     }

//     async delete(filter: Partial<T>): Promise<T | null> {
//         try {
//             const result = await this.model.findOneAndDelete(filter);
//             return result;
//         } catch (error) {
//             throw new Error("failed to delete document");
//         }
//     }


// }

import { Model ,Document} from "mongoose";
import { IBaseRepository } from "../interface/IBaseRepository";


export class BaseRepository<T extends Document> implements IBaseRepository<T> {
    
    /**
     * Constructor for the BaseRepository class
     * @param model The mongoose model for the collection
     */
    constructor( protected readonly model: Model<T>) { }

    /**
     * Create a new document in the database
     * @param item The data to create the document with
     * @returns The created document
     */
    async create(item: Partial<T>): Promise<T> {
        try {
            // Create a new document using the provided data
            const createdDocument = new this.model(item);
            return await createdDocument.save();
        } catch (error) {
            // If there is an error, throw a specific error message
            throw error;
        }
    }

    async findOne(email: string): Promise<T | null> {
        try {
            const result = await this.model.findOne({email});
            return result;
        } catch (error) {
            throw error;
        }
    }
}
