"use server"

import { IGetAllTagsParams, IGetTopInteractedTagsParams } from "@/types/shared";
import { connectToDatabase } from "../mongoose";
import User from "@/database/user.model";
import Tag from "@/database/tag.model";

export async function getAllTags(params: IGetAllTagsParams) {
    try {
        connectToDatabase();

        // const { page = 1, pageSize = 20, filter, searchQuery } = params;

        const tags = await Tag.find({})
            .sort({ createdAt: -1 });
        
        return {
            tags
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getTopInteractedTags(params: IGetTopInteractedTagsParams) {
    try {
        connectToDatabase();

        const { userId } = params;

        const user = await User.findById(userId);

        if (!user) throw new Error("User not found");

        // Find interaction for the user and group by tags
        // Interaction...

        return [
            {
                _id: "1",
                name: "react"
            },
            {
                _id: "2",
                name: "next.js"
            },
            {
                _id: "3",
                name: "mongoose"
            },
        ]
    } catch (error) {
        console.log(error);
        throw error;
    }
}