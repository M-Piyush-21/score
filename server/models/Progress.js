import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
    },
    completedLectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "lecture",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

export const Progress = mongoose.model("progress", schema);
