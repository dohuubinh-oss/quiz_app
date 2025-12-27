
import { Document, Schema, model, models } from 'mongoose';

export interface IQuestion {
    questionText: string;
    options: { optionText: string; isCorrect: boolean; }[];
}

export interface IQuiz extends Document {
    title: string;
    description: string;
    // Sử dụng camelCase cho coverImage
    coverImage: string; 
    questions: IQuestion[];
    // Sử dụng camelCase cho authorId
    authorId: Schema.Types.ObjectId;
    published: boolean;
}

const QuestionSchema = new Schema<IQuestion>({
    questionText: { type: String, required: true },
    options: [{
        optionText: { type: String, required: true },
        isCorrect: { type: Boolean, required: true, default: false },
    }],
});

const QuizSchema = new Schema<IQuiz>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    // Cập nhật ở đây
    coverImage: { type: String, required: false }, 
    questions: [QuestionSchema],
    // Cập nhật ở đây
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    published: { type: Boolean, default: false },
}, { timestamps: true });

export const Quiz = models.Quiz || model<IQuiz>('Quiz', QuizSchema);
