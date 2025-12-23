'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Typography, Button, Spin, Space, App, Card } from 'antd';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';
import { useQuiz } from '@/api/hooks/useQuiz';
import { useQuizQuestions } from '@/api/hooks/useQuestions';
import { useTogglePublishQuiz } from '@/api/hooks/useQuizzes';
import QuizPreview from '@/components/quiz/QuizPreview';
import { useAuth } from '@/lib/auth';
import Image from 'next/image';

const { Title, Paragraph } = Typography;

function PreviewQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;
  const { user } = useAuth();
  const { message } = App.useApp();

  const { data: quiz, isLoading: isLoadingQuiz } = useQuiz(quizId);
  const { data: questions = [], isLoading: isLoadingQuestions } =
    useQuizQuestions(quizId);
  const togglePublishMutation = useTogglePublishQuiz();

  // Check if user is the owner of the quiz
  useEffect(() => {
    if (quiz && user && quiz.author_id !== user.id) {
      message.error("You don't have permission to preview this quiz");
      router.push('/quizzes');
    }
  }, [quiz, user, router, message]);

  const handlePublish = async () => {
    if (questions.length === 0) {
      message.error('Cannot publish a quiz with no questions');
      return;
    }

    await togglePublishMutation.mutateAsync({
      id: quizId,
      publish: true,
    });
    message.success('Quiz published successfully');
    router.push(`/quizzes/${quizId}/published`);
  };

  if (isLoadingQuiz || isLoadingQuestions) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center">
        <Title level={4} className="text-red-500">
          Quiz not found
        </Title>
        <Paragraph>
          The quiz you're looking for doesn't exist or has been removed.
        </Paragraph>
        <Button type="primary" onClick={() => router.push('/quizzes')}>
          Back to Quizzes
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Preview Quiz</Title>
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => router.push(`/quizzes/${quizId}`)}
          >
            Edit
          </Button>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={handlePublish}
            disabled={questions.length === 0}
          >
            Publish
          </Button>
        </Space>
      </div>

      {quiz.cover_image && (
        <Card className="mb-6 overflow-hidden shadow-sm">
          <div className="relative h-48 w-full">
            <Image
              src={quiz.cover_image || '/placeholder.svg'}
              alt={quiz.title}
              fill
              className="object-cover rounded-md"
            />
          </div>
          <div className="mt-4">
            <Title level={3}>{quiz.title}</Title>
            <Paragraph>{quiz.description}</Paragraph>
          </div>
        </Card>
      )}

      <QuizPreview quiz={quiz} questions={questions} readOnly={true} />
    </div>
  );
}

export default function PreviewQuizPageWrapper() {
  return (
    <App>
      <PreviewQuizPage />
    </App>
  );
}
