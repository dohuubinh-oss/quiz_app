"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { IQuiz } from "@/models/Quiz"; // Thay đổi: Import từ model MongoDB
import axios from "axios"; // Sử dụng axios để gọi API

// ---------- Bắt đầu các hàm gọi API mới ----------

const fetchQuizzes = async (page: number, pageSize: number, searchTerm: string) => {
  const { data } = await axios.get('/api/quizzes', {
    params: {
      page,
      pageSize,
      search: searchTerm,
      // Thêm các tham số khác nếu API của bạn hỗ trợ, ví dụ: isPublished
    },
  });
  return data;
};

const createNewQuiz = async (quiz: Partial<IQuiz>) => {
  const { data } = await axios.post('/api/quizzes', quiz);
  return data;
};

const updateExistingQuiz = async ({ id, updates }: { id: string; updates: Partial<IQuiz> }) => {
  const { data } = await axios.put(`/api/quizzes/${id}`, updates);
  return data;
};

const deleteExistingQuiz = async (id: string) => {
  const { data } = await axios.delete(`/api/quizzes/${id}`);
  return data;
};

// Hàm này có thể được xử lý bởi updateExistingQuiz bằng cách truyền { isPublished: boolean }
const togglePublishStatus = async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
  const { data } = await axios.put(`/api/quizzes/${id}`, { isPublished });
  return data;
};

// ---------- Kết thúc các hàm gọi API mới ----------


// Hook to fetch all quizzes with pagination
export const useQuizzes = (
  page = 1,
  pageSize = 9,
  searchTerm: string
) => {
  return useQuery({
    // Thay đổi: Cập nhật queryKey và queryFn
    queryKey: ["quizzes", page, pageSize, searchTerm],
    queryFn: () => fetchQuizzes(page, pageSize, searchTerm),
    // enabled không cần thiết vì API route sẽ xử lý logic của nó
  });
};

// Hook to create a new quiz
export const useCreateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // Thay đổi: Sử dụng hàm gọi API mới
    mutationFn: createNewQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });
};

// Hook to update a quiz
export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // Thay đổi: Sử dụng hàm gọi API mới
    mutationFn: updateExistingQuiz,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      // Giả sử data trả về có id
      if (data && data._id) {
        queryClient.invalidateQueries({ queryKey: ["quiz", data._id] });
      }
    },
  });
};

// Hook to delete a quiz
export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // Thay đổi: Sử dụng hàm gọi API mới
    mutationFn: deleteExistingQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });
};

// Hook to toggle publish status
export const useTogglePublishQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // Thay đổi: Sử dụng hàm gọi API mới
    mutationFn: togglePublishStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
       if (data && data._id) {
        queryClient.invalidateQueries({ queryKey: ["quiz", data._id] });
      }
    },
  });
};
