import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courses",
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deadline: {
      type: Date,
      default: null,
    },
    questions: [
      {
        type: {
          type: String,
          enum: ["mcq", "free-text", "true-false"], // Add more types as needed
          required: true,
        },
        questionText: {
          type: String,
          required: true,
        },
        options: [
          {
            text: String,
            isCorrect: Boolean, // Used for MCQ and true-false
          },
        ],
        maxMarks: {
          type: Number,
          default: 1, // Define max marks per question for grading
        },
      },
    ],
    submissions: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        answers: [
          {
            questionIndex: Number, // Index of the question in the questions array
            answer: String, // For free-text, selected option text for MCQ, "true"/"false" for true-false
          },
        ],
        submittedAt: {
          type: Date,
          default: Date.now,
        },
        marks: {
          type: Number,
          default: null, // Total marks, updated manually or auto-calculated
        },
      },
    ],
  },
  { timestamps: true }
);

export const Assignment = mongoose.model("Assignment", assignmentSchema);