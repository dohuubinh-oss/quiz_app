"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { IQuestion } from "@/models/Quiz";

// Không cần hook 'useQuizQuestions' nữa vì dữ liệu câu hỏi
// đã được bao gồm trong hook 'useQuiz'. Điều này tránh việc gọi API hai lần.

// Hook để tạo một câu hỏi mới
export const useCreateQuestion = (quizId: string) => {
  const queryClient = useQueryClient();
  return useMutation<IQuestion, Error, Omit<IQuestion, '_id'>>({
    mutationFn: (newQuestion) => 
      axios.post(`/api/quizzes/${quizId}/questions`, newQuestion).then(res => res.data.question),
    onSuccess: () => {
      // Làm mất hiệu lực query của quiz để nạp lại dữ liệu, bao gồm cả câu hỏi mới
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
    },
  });
};

// Hook để cập nhật một câu hỏi
export const useUpdateQuestion = (quizId: string) => {
  const queryClient = useQueryClient();
  return useMutation<IQuestion, Error, { questionId: string; updates: Partial<IQuestion> }>({ 
    mutationFn: ({ questionId, updates }) =>
      axios.put(`/api/quizzes/${quizId}/questions/${questionId}`, updates).then(res => res.data.question),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
    },
  });
};

// Hook để xóa một câu hỏi
export const useDeleteQuestion = (quizId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({ // string ở đây là questionId
    mutationFn: (questionId) => 
      axios.delete(`/api/quizzes/${quizId}/questions/${questionId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
    },
  });
};

// Hook để sắp xếp lại các câu hỏi
export const useReorderQuestions = (quizId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { questionIds: string[] }>({ // Chỉnh sửa kiểu dữ liệu ở đây
    mutationFn: ({ questionIds }) => 
      axios.put(`/api/quizzes/${quizId}/questions`, { questionIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
    },
  });
};
