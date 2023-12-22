"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import { ICreateQuestionParams, IGetQuestionsParams } from "@/types/shared";
import { revalidatePath } from "next/cache";
import User from "@/database/user.model";

export async function getQuestions(params: IGetQuestionsParams) {
    try {
        connectToDatabase();
        
        const questions = await Question.find()
            .populate({ path: 'tags', model: Tag })
            .populate({ path: 'author', model: User })
            .sort({ createdAt: -1 });
        return {
            questions
        };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function createQuestion(params: ICreateQuestionParams) {
  try {
    // connect to DB
    connectToDatabase();
    const { title, content, tags, author, path } = params;

    // Create the question
    const question = await Question.create({
      title,
      content,
      author,
    });
    const tagDocuments = [];

    // create tag or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        {
          name: {
            $regex: new RegExp(`^${tag}^$`, "i"),
          },
        },
        {
          $setOnInsert: {
            name: tag,
          },
          $push: {
            questions: question._id,
          },
        },
        {
            upsert: true,
            new: true
        }
      );
      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
        $push: { tags: { $each: tagDocuments } }
    });

    // Create an interaction record for the user's ask_question action

    // Increment author's reputation by 5 points for asking a question

    // revalidatePath allows you to purge cached data for a specific path
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
