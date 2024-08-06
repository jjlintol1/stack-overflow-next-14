import { Document, Schema, model, models } from "mongoose";

export interface IUser extends Document {
    clerkId: string;
    name: string;
    username: string;
    email: string;
    password?: string;
    bio?: string;
    picture: string;
    location?: string;
    portfolioWebsite?: string;
    reputation?: number;
    saved: Schema.Types.ObjectId[];
    joinedAt: Date;
}

const userSchema = new Schema<IUser>({
    clerkId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    bio: String,
    picture: {
        type: String,
        required: true
    },
    location: String,
    portfolioWebsite: String,
    reputation: {
        type: Number,
        default: 0
    },
    saved: [{
        type: Schema.Types.ObjectId,
        ref: "Question"
    }],
    joinedAt: {
        type: Date,
        default: Date.now
    }
});

const User = models.User || model<IUser>('User', userSchema);

export default User;