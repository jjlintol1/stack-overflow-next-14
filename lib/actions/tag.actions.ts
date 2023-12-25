"use server"

import { IGetTopInteractedTagsParams } from "@/types/shared";
import { connectToDatabase } from "../mongoose";
import User from "@/database/user.model";

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