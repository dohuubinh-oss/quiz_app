# ⚛️ Next.js Quiz Platform 📝 🚀

Welcome to the Next.js Quiz Platform! This interactive application allows users to create, manage, and share quizzes with customizable questions and answers.

![Quiz Platform Banner](https://res.cloudinary.com/df4jaqtep/image/upload/v1747761197/r2ubf8azeanzlkvbshwz.png)

## 🔍 Overview

This quiz platform is built with Next.js and Supabase, offering a complete solution for creating and taking quizzes. Users can sign up, create quizzes with various question types, publish them for others to take, and view results.

The platform features a clean, responsive UI built with Ant Design and Tailwind CSS, with a focus on usability and performance.

## 📚 What You'll Learn

By exploring this codebase, you'll learn how to:

- Build a full-stack application with Next.js and Supabase
- Implement authentication and authorization
- Create dynamic forms with validation
- Manage complex state with React Query
- Implement drag-and-drop functionality with DND Kit
- Create responsive layouts with Ant Design and Tailwind CSS
- Deploy a Next.js application with database integration

## 🛠️ Tech Stack

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: For type safety and better developer experience
- **Supabase**: Backend-as-a-Service for authentication and database
- **React Query**: For server state management
- **Ant Design**: UI component library
- **Tailwind CSS**: Utility-first CSS framework
- **DND Kit**: Drag and drop toolkit for React
- **React Hook Form**: Form validation library

## 💻 Features

- **User Authentication**: Sign up, login, and user profile management
- **Quiz Creation**: Create quizzes with title, description, and cover image
- **Question Management**: Add, edit, and reorder questions with drag-and-drop
- **Multiple Question Types**: Support for two-choice, four-choice, and text input questions
- **Quiz Publishing**: Publish quizzes to make them available to others
- **Quiz Taking**: Interactive interface for taking quizzes
- **Results Review**: Detailed feedback on quiz performance
- **Responsive Design**: Works on desktop and mobile devices

## 🧠 Project Structure

```
quiz-platform/
├── app/                  # App Router directory
│   ├── login/            # Login page
│   ├── quizzes/          # Quiz-related pages
│   │   ├── [id]/         # Individual quiz pages
│   │   │   ├── published/# Published quiz view
│   │   │   ├── preview/  # Quiz preview
│   │   ├── new/          # New quiz creation
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── api/                  # API functions
│   ├── hooks/            # React Query hooks
│   ├── supabase/         # Supabase API functions
├── components/           # Reusable components
│   ├── quiz/             # Quiz-related components
├── lib/                  # Utility functions and shared logic
│   ├── auth.tsx          # Authentication provider
│   ├── supabase.ts       # Supabase client
│   ├── types.ts          # TypeScript types
├── public/               # Static assets
├── next.config.js        # Next.js configuration
├── package.json          # Project dependencies
└── tailwind.config.js    # Tailwind configuration
```

## 📦 Installation

### Prerequisites

- Node.js 18 or later
- npm, yarn, or pnpm
- Supabase account

<!-- ### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/nextjs-quiz-platform.git
   cd nextjs-quiz-platform
   ```

2. Install dependencies:

```shellscript
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:

```plaintext
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:

```shellscript
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Database Setup

This project uses Supabase as its database. The SQL schema is included in the `supabase/schema.sql` file. You can run this in your Supabase SQL editor to set up the required tables and policies.

## 🚀 Deployment

### Deploying to Vercel

The easiest way to deploy your Next.js app is to use [Vercel](https://vercel.com):

1. Push your code to a GitHub repository
2. Import your project into Vercel
3. Add your Supabase environment variables
4. Deploy!

## ✨ Key Features Walkthrough

### Authentication

The platform uses Supabase Auth for user authentication. The `AuthProvider` in `lib/auth.tsx` manages the authentication state and provides login/signup functionality.

### Quiz Management

Quizzes can be created, edited, and published. The quiz editor supports:

- Adding a title and description
- Uploading a cover image
- Adding different types of questions
- Reordering questions with drag-and-drop

### Question Types

The platform supports three question types:

- **Two Choices**: Simple yes/no or true/false questions
- **Four Choices**: Multiple choice questions with four options
- **Text Input**: Questions requiring a text answer

### Taking Quizzes

Published quizzes can be taken by any user. The quiz interface shows:

- Progress through the quiz
- Current question and options
- Navigation between questions
- Results and feedback at the end

Happy quizzing! 📝✨

If you have any questions or need help, feel free to open an issue in this repository.

Don't forget to star ⭐ this repository if you found it helpful!

```

``` -->
