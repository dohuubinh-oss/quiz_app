
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Typography,
  Button,
  Form,
  Input,
  Card,
  Upload,
  Modal,
  App,
} from "antd";
import { useCreateQuiz } from "@/api/hooks/useQuizzes";
import { useAuth } from "@/lib/auth";
import { InboxOutlined } from "@ant-design/icons";
import { uploadCoverImage } from "@/lib/storage";
import Image from "next/image";

const { Title } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

function NewQuizPageContent() {
  const router = useRouter();
  const { message } = App.useApp();
  const createQuizMutation = useCreateQuiz();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleCreateQuiz = async (values: any) => {
    if (!coverImageFile) {
      message.error("A cover image is required.");
      return;
    }

    try {
      if (!user) {
        message.error("You must be logged in to create a quiz.");
        return;
      }

      setUploading(true);

      const coverImageUrl = await uploadCoverImage(coverImageFile);
      if (!coverImageUrl) {
        message.error("Failed to upload cover image");
        setUploading(false);
        return;
      }

      // **LOẠI BỎ author_id: user.id**
      // Server sẽ tự động xử lý việc này
      const newQuiz = await createQuizMutation.mutateAsync({
        title: values.title,
        description: values.description,
        published: false,
        coverImage: coverImageUrl,
      });

      message.success("Quiz created successfully");
      router.push(`/quizzes/${newQuiz.id}`);
    } catch (error) {
      message.error("Failed to create quiz");
      setUploading(false);
    }
  };

  const handleImageChange = (info: any) => {
    const file = info.file.originFileObj || info.file;
    setCoverImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadProps = {
    name: "file",
    multiple: false,
    accept: "image/*",
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Image must be smaller than 2MB!");
      }
      return false; // Prevent automatic upload
    },
    onChange: handleImageChange,
  };

  return (
    <div>
      <Title level={2} className="mb-6">
        Create New Quiz
      </Title>

      <Card>
        <Form form={form} layout="vertical" onFinish={handleCreateQuiz}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input placeholder="Quiz title" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <TextArea rows={4} placeholder="Quiz description" />
          </Form.Item>

          <Form.Item label="Cover Image" required>
            {previewImage ? (
              <div className="relative">
                <div
                  className="relative w-full h-48 mb-4 cursor-pointer"
                  onClick={() => setPreviewVisible(true)}
                >
                  <Image
                    src={previewImage || "/placeholder.svg"}
                    alt="Cover preview"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <Button
                  onClick={() => {
                    setCoverImageFile(null);
                    setPreviewImage(null);
                  }}
                >
                  Change Image
                </Button>
              </div>
            ) : (
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single image upload. Please upload an image
                  smaller than 2MB.
                </p>
              </Dragger>
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={uploading}>
              Create Quiz
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Modal
        open={previewVisible}
        title="Cover Image Preview"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        {previewImage && (
          <img
            alt="Cover preview"
            style={{ width: "100%" }}
            src={previewImage || "/placeholder.svg"}
          />
        )}
      </Modal>
    </div>
  );
}

export default function NewQuizPage() {
  return (
    <App>
      <NewQuizPageContent />
    </App>
  );
}
