"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { IQuiz } from "@/models/Quiz";

// Hàm gọi API mới để lấy một quiz bằng ID
const fetchQuizById = async (id: string): Promise<IQuiz> => {
  const { data } = await axios.get(`/api/quizzes/${id}`);
  // API route của bạn trả về một object có key là 'quiz'
  return data.quiz;
};

// Hook để lấy một quiz duy nhất bằng ID
export const useQuiz = (id: string) => {
  return useQuery({
    queryKey: ["quiz", id],
    // Sử dụng hàm gọi API mới
    queryFn: () => fetchQuizById(id),
    // Query sẽ chỉ được kích hoạt khi có `id`.
    // Việc xác thực (quiz có public hay không, người dùng có phải tác giả không)
    // sẽ được xử lý ở phía API route, giúp client đơn giản hơn.
    enabled: !!id,
  });
};
