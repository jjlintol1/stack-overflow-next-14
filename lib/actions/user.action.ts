"use server"

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose"
import { ICreateUserParams, IDeleteUserParams, IGetAllUsersParams, IGetUserByIdParams, IUpdateUserParams } from "@/types/shared";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

export async function getAllUsers(params: IGetAllUsersParams) {
    try {
        connectToDatabase();

        // const { page = 1, pageSize = 20, filter, searchQuery } = params;

        // Retrieve all users from database
        const users = await User.find({})
            .sort({ joinedAt: -1 });

        return {
            users
        };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getUserById(params: IGetUserByIdParams) {
    try {
        connectToDatabase();
        const { userId } = params;

        const user = await User.findOne({
            clerkId: userId
        });
        return user;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function createUser(params: ICreateUserParams) {
    try {
        connectToDatabase();
        const newUser = await User.create(params);
        return newUser;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function updateUser(params: IUpdateUserParams) {
    try {
        connectToDatabase();
        const { clerkId, updateData, path } = params;
        const newUser = await User.findOneAndUpdate({
            clerkId
        }, updateData, {
            new: true
        });
        revalidatePath(path);
        return newUser;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export async function deleteUser(params: IDeleteUserParams) {
    try {
        connectToDatabase();
        const { clerkId } = params;
        const user = await User.findOne({
            clerkId
        });

        if (!user) throw new Error('User not found');

        // Delete user from database
        // and questions, answers, documents, etc

        // get user question ids
        // const userQuestionIds = await Question.find({
        //     author: user._id
        // }).distinct('_id');

        // delete user questions
        await Question.deleteMany({ author: user._id });

        // TODO: delete user answers, comments, etc.

        const deletedUser = await User.findByIdAndDelete(user._id);
        return deletedUser;
        
    } catch (error) {
        console.log(error);
        throw error;
    }
}