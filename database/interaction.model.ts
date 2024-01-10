import { Schema, model, models, Document } from "mongoose";

/* eslint-disable */
export enum INTERACTION_TYPES {
  VIEW = "view",
  ASK_QUESTION = "ask_question",
  ANSWER = "answer",
}
/* eslint-enable */

export interface IInteraction extends Document {
  user: Schema.Types.ObjectId; // reference to user
  action: string;
  question: Schema.Types.ObjectId;
  answer: Schema.Types.ObjectId;
  tags: Schema.Types.ObjectId[];
  createdAt: Date;
}

const interactionSchema = new Schema<IInteraction>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  question: {
    type: Schema.Types.ObjectId,
    ref: "Question",
  },

  answer: {
    type: Schema.Types.ObjectId,
    ref: "Answer",
  },

  tags: [{
    type: Schema.Types.ObjectId,
    ref: "Tag",
  }],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Interaction =
  models.Interaction || model<IInteraction>("Interaction", interactionSchema);

export default Interaction;
