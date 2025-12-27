'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Card, Typography, Radio } from 'antd';
import { useForm, Controller } from 'react-hook-form';
// Giữ nguyên kiểu IQuestion từ model để đảm bảo tính nhất quán
import type { IQuestion } from '@/models/Quiz';

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Định nghĩa lại props để nhận đúng kiểu dữ liệu từ server
interface QuestionFormProps {
  initialData?: IQuestion;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

// Hàm "phiên dịch" dữ liệu từ server (IQuestion) sang định dạng cho Form
const transformDataForForm = (question?: IQuestion) => {
  if (!question) {
    return {
      question_text: '',
      // Mặc định là 4 lựa chọn, giữ nguyên logic cũ của form
      question_type: 'four_choices',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: '',
    };
  }

  const correctIndex = question.options.findIndex(opt => opt.isCorrect);
  const correctLetter = ['a', 'b', 'c', 'd'][correctIndex];

  return {
    question_text: question.questionText,
    question_type: question.options.length <= 2 ? 'two_choices' : 'four_choices',
    option_a: question.options[0]?.optionText || '',
    option_b: question.options[1]?.optionText || '',
    option_c: question.options[2]?.optionText || '',
    option_d: question.options[3]?.optionText || '',
    correct_answer: correctLetter || '',
  };
};

const QuestionForm: React.FC<QuestionFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  // Sử dụng hàm "phiên dịch" để tạo giá trị mặc định
  const formDefaultValues = transformDataForForm(initialData);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset, // Thêm reset từ react-hook-form
    formState: { errors },
  } = useForm({
    defaultValues: formDefaultValues,
  });

  const questionType = watch('question_type');
  const [correctAnswer, setCorrectAnswer] = useState(
    formDefaultValues.correct_answer
  );

  // useEffect để cập nhật form khi initialData thay đổi (khi người dùng click edit)
  useEffect(() => {
    const newDefaultValues = transformDataForForm(initialData);
    reset(newDefaultValues); // Dùng reset để cập nhật toàn bộ form
    setCorrectAnswer(newDefaultValues.correct_answer);
  }, [initialData, reset]);

  useEffect(() => {
    setValue('correct_answer', correctAnswer);
  }, [correctAnswer, setValue]);

  // Sửa lại hàm submit để "phiên dịch" dữ liệu cho API
  const handleFormSubmit = (data: any) => {
    const optionsArray: string[] = [];
    if (data.option_a) optionsArray.push(data.option_a);
    if (data.option_b) optionsArray.push(data.option_b);
    // Chỉ thêm option c và d nếu là loại 4 lựa chọn
    if (questionType === 'four_choices') {
        if (data.option_c) optionsArray.push(data.option_c);
        if (data.option_d) optionsArray.push(data.option_d);
    }

    const correctOptionMap: { [key: string]: number } = { a: 0, b: 1, c: 2, d: 3 };
    const correctIndex = correctOptionMap[data.correct_answer];

    const formattedDataForApi = {
      questionText: data.question_text,
      options: optionsArray,
      correctOptionIndex: correctIndex,
    };
    
    // Gửi đi dữ liệu đã được định dạng đúng
    onSubmit(formattedDataForApi);
  };

  // --- TOÀN BỘ PHẦN JSX VÀ CLASSNAME BÊN DƯỚI ĐƯỢC GIỮ NGUYÊN 100% ---
  return (
    <Card className="shadow-xl border-0 rounded-3xl overflow-hidden bg-white animate-fade-in-up">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 border-b border-gray-100">
        <Title level={3} className="mb-3 text-gray-800">
          {initialData ? '✏️ Edit Question' : '➕ Add New Question'}
        </Title>
        <Paragraph className="text-gray-600 mb-0 text-lg">
          Create engaging questions for your quiz
        </Paragraph>
      </div>

      <div className="p-8">
        <Form layout="vertical" onFinish={handleSubmit(handleFormSubmit)}>
          <div className="space-y-8">
            {/* Question Text */}
            <Controller
              name="question_text"
              control={control}
              rules={{ required: 'Question text is required' }}
              render={({ field, fieldState }) => (
                <Form.Item
                  label={
                    <span className="text-gray-700 font-semibold text-lg">
                      📝 Question Text
                    </span>
                  }
                  validateStatus={fieldState.error ? 'error' : ''}
                  help={fieldState.error?.message}
                >
                  <TextArea
                    {...field}
                    rows={3}
                    placeholder="Enter your question here..."
                    className="text-lg border-2 border-gray-200 rounded-2xl hover:border-blue-400 focus:border-blue-500 transition-all duration-300 shadow-sm focus:shadow-lg"
                  />
                </Form.Item>
              )}
            />

            {/* Question Type */}
            <Controller
              name="question_type"
              control={control}
              rules={{ required: 'Question type is required' }}
              render={({ field, fieldState }) => (
                <Form.Item
                  label={
                    <span className="text-gray-700 font-semibold text-lg">
                      🎯 Question Type
                    </span>
                  }
                  validateStatus={fieldState.error ? 'error' : ''}
                  help={fieldState.error?.message}
                >
                  <Select
                    {...field}
                    placeholder="Select question type"
                    size="large"
                    className="rounded-2xl"
                    onChange={value => {
                      field.onChange(value);
                      setCorrectAnswer('');
                    }}
                  >
                    <Option value="two_choices">
                      <div className="flex items-center space-x-3 py-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">
                          Two Choices (Binary Choice)
                        </span>
                      </div>
                    </Option>
                    <Option value="four_choices">
                      <div className="flex items-center space-x-3 py-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="font-medium">
                          Four Choices (Multiple Choice)
                        </span>
                      </div>
                    </Option>
                    {/* Loại input không được hỗ trợ bởi model hiện tại, giữ nguyên trong UI nhưng logic submit sẽ bỏ qua */}
                    <Option value="input">
                      <div className="flex items-center space-x-3 py-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">Text Input</span>
                      </div>
                    </Option>
                  </Select>
                </Form.Item>
              )}
            />

            {/* Answer Options */}
            {(questionType === 'two_choices' ||
              questionType === 'four_choices') && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Title level={4} className="mb-0 text-gray-700">
                    🎨 Answer Options
                  </Title>
                  <Paragraph className="text-sm text-gray-500 mb-0">
                    Select the correct answer below
                  </Paragraph>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Option A */}
                  <Controller
                    name="option_a"
                    control={control}
                    rules={{ required: 'Option A is required' }}
                    render={({ field, fieldState }) => (
                      <Form.Item
                        validateStatus={fieldState.error ? 'error' : ''}
                        help={fieldState.error?.message}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <Radio
                              checked={correctAnswer === 'a'}
                              onChange={() => setCorrectAnswer('a')}
                              className="text-lg"
                            />
                            <span className="font-semibold text-gray-700">
                              Option A
                            </span>
                          </div>
                          <Input
                            {...field}
                            placeholder="Enter option A"
                            size="large"
                            className="border-2 border-gray-200 rounded-xl hover:border-blue-400 focus:border-blue-500 transition-all duration-300"
                          />
                        </div>
                      </Form.Item>
                    )}
                  />

                  {/* Option B */}
                  <Controller
                    name="option_b"
                    control={control}
                    rules={{ required: 'Option B is required' }}
                    render={({ field, fieldState }) => (
                      <Form.Item
                        validateStatus={fieldState.error ? 'error' : ''}
                        help={fieldState.error?.message}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <Radio
                              checked={correctAnswer === 'b'}
                              onChange={() => setCorrectAnswer('b')}
                              className="text-lg"
                            />
                            <span className="font-semibold text-gray-700">
                              Option B
                            </span>
                          </div>
                          <Input
                            {...field}
                            placeholder="Enter option B"
                            size="large"
                            className="border-2 border-gray-200 rounded-xl hover:border-blue-400 focus:border-blue-500 transition-all duration-300"
                          />
                        </div>
                      </Form.Item>
                    )}
                  />

                  {/* Option C - Only for four choices */}
                  {questionType === 'four_choices' && (
                    <Controller
                      name="option_c"
                      control={control}
                      rules={{ required: 'Option C is required' }}
                      render={({ field, fieldState }) => (
                        <Form.Item
                          validateStatus={fieldState.error ? 'error' : ''}
                          help={fieldState.error?.message}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <Radio
                                checked={correctAnswer === 'c'}
                                onChange={() => setCorrectAnswer('c')}
                                className="text-lg"
                              />
                              <span className="font-semibold text-gray-700">
                                Option C
                              </span>
                            </div>
                            <Input
                              {...field}
                              placeholder="Enter option C"
                              size="large"
                              className="border-2 border-gray-200 rounded-xl hover:border-blue-400 focus:border-blue-500 transition-all duration-300"
                            />
                          </div>
                        </Form.Item>
                      )}
                    />
                  )}

                  {/* Option D - Only for four choices */}
                  {questionType === 'four_choices' && (
                    <Controller
                      name="option_d"
                      control={control}
                      rules={{ required: 'Option D is required' }}
                      render={({ field, fieldState }) => (
                        <Form.Item
                          validateStatus={fieldState.error ? 'error' : ''}
                          help={fieldState.error?.message}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <Radio
                                checked={correctAnswer === 'd'}
                                onChange={() => setCorrectAnswer('d')}
                                className="text-lg"
                              />
                              <span className="font-semibold text-gray-700">
                                Option D
                              </span>
                            </div>
                            <Input
                              {...field}
                              placeholder="Enter option D"
                              size="large"
                              className="border-2 border-gray-200 rounded-xl hover:border-blue-400 focus:border-blue-500 transition-all duration-300"
                            />
                          </div>
                        </Form.Item>
                      )}
                    />
                  )}
                </div>

                {/* Correct Answer Validation */}
                <Controller
                  name="correct_answer"
                  control={control}
                  rules={{ required: 'Please select the correct answer' }}
                  render={({ fieldState }) => (
                    <Form.Item
                      validateStatus={fieldState.error ? 'error' : ''}
                      help={fieldState.error?.message}
                    >
                      <input type="hidden" value={correctAnswer} />
                    </Form.Item>
                  )}
                />
              </div>
            )}

            {/* Text Input Answer */}
            {questionType === 'input' && (
              <Controller
                name="correct_answer"
                control={control}
                rules={{
                  required:
                    'Correct answer is required for text input questions',
                }}
                render={({ field, fieldState }) => (
                  <Form.Item
                    label={
                      <span className="text-gray-700 font-semibold text-lg">
                        ✅ Correct Answer
                      </span>
                    }
                    validateStatus={fieldState.error ? 'error' : ''}
                    help={fieldState.error?.message}
                  >
                    <Input
                      {...field}
                      placeholder="Enter the correct answer"
                      size="large"
                      className="border-2 border-gray-200 rounded-xl hover:border-blue-400 focus:border-blue-500 transition-all duration-300 shadow-sm focus:shadow-lg"
                    />
                  </Form.Item>
                )}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-8 border-t border-gray-100 mt-8">
            <Button
              onClick={onCancel}
              size="large"
              className="h-12 px-8 border-2 border-gray-300 hover:border-gray-400 transition-all duration-300 rounded-xl font-medium"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="h-12 px-8 bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-xl font-medium"
            >
              {initialData ? '✏️ Update Question' : '➕ Add Question'}
            </Button>
          </div>
        </Form>
      </div>
    </Card>
  );
};

export default QuestionForm;
