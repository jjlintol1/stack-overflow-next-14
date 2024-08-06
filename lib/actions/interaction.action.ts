"use server"

import { IViewQuestionParams } from "@/types/shared";
import { connectToDatabase } from "../mongoose";
import Question from "@/database/question.model";
import Interaction, { INTERACTION_TYPES } from "@/database/interaction.model";

export async function viewQuestion(params: IViewQuestionParams) {
    try {
        await connectToDatabase();
        const { questionId, userId } = params;

        // Update view count for question
        await Question.findByIdAndUpdate(questionId, {
            $inc: { views: 1 }
        });

        if (userId) {
            const existingInteraction = await Interaction.findOne({ 
                user: userId,
                action: INTERACTION_TYPES.VIEW,
                question: questionId
             });

             if (existingInteraction) return console.log("User has already viewed");

             // Create interaction
             await Interaction.create({
                user: userId,
                action: INTERACTION_TYPES.VIEW,
                question: questionId
             });
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}