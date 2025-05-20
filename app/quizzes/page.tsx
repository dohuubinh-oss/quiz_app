"use client";

import { useState } from "react";
import { Typography, Row, Col, Spin, Empty, Pagination, Button } from "antd";
import QuizCard from "@/components/quiz/QuizCard";
import { useQuizzes } from "@/api/hooks/useQuizzes";
import { useAuth } from "@/lib/auth";
import Link from "next/link";

const { Title } = Typography;

export default function QuizzesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9; // 3 quizzes per row, 3 rows
  const { user } = useAuth();

  // Use the React Query hook to fetch quizzes with pagination
  const {
    data: paginatedQuizzes,
    isLoading,
    error,
    isFetching,
  } = useQuizzes(currentPage, pageSize, true); // Pass true to indicate this can be a public route

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <Title level={4} className="text-red-500">
          Error loading quizzes
        </Title>
        <p>Please try again later.</p>
      </div>
    );
  }

  const quizzes = paginatedQuizzes?.data || [];
  const total = paginatedQuizzes?.total || 0;

  if (quizzes.length === 0) {
    return (
      <div className="text-center py-12">
        <Empty
          description={
            <span>No quizzes found. {user && "Create your first quiz!"}</span>
          }
        />
        {user && (
          <Link href="/quizzes/new">
            <Button type="primary" className="mt-4">
              Create Quiz
            </Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>All Quizzes</Title>
        <div>
          {isFetching && <Spin className="mr-2" />}
          <span>Total: {total} quizzes</span>
        </div>
      </div>

      <div
        className={
          isFetching ? "opacity-60 transition-opacity duration-300" : ""
        }
      >
        <Row gutter={[24, 24]}>
          {quizzes.map((quiz) => (
            <Col xs={24} md={12} lg={8} key={quiz.id}>
              <QuizCard quiz={quiz} />
            </Col>
          ))}
        </Row>
      </div>

      {total > pageSize && (
        <div className="flex justify-center mt-8">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={handlePageChange}
            showSizeChanger={false}
            showQuickJumper
            disabled={isFetching}
          />
        </div>
      )}
    </div>
  );
}
