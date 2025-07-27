
# Next.js + tRPC + Supabase Chat App

A modern, user-friendly chat application built with **Next.js**, **tRPC**, and **Supabase**, allowing users to sign up, select from various AI models (including **real Google Gemini 2.0 Flash integration**), and engage in real-time chat with a sleek, responsive UI. This project is designed to be intuitive, type-safe, and easy to set up for beginners.

---

## 📖 Project Overview

### Understanding the Problem
The goal was to create a chat application where users can:
- **Sign up and log in** using email and password via Supabase Auth.
- **Select an AI model** from a dropdown (e.g., Gemini 2.0 Flash, GPT-4o, Claude 3 Sonnet) to drive their chat session.
- **Send and receive messages** in a modern chat interface with message bubbles, timestamps, and auto-scrolling.
- **Persist messages** in a Supabase PostgreSQL database with proper relationships and Row-Level Security (RLS).
- **Integrate a real AI model** (Google Gemini 2.0 Flash) for live responses, with simulated responses for other models as a fallback.
- **Ensure a polished UI** with Tailwind CSS, shadcn/ui components, dark mode, and mobile responsiveness.
- **Use tRPC** for type-safe API interactions between the frontend and backend.
- **Meet stretch goals** like dark mode, typing indicators, and a modern UI.

The application needed to be intuitive, performant, and easy to set up, with clear instructions for deployment and future extensibility.

### High-Level Plan / Architecture
The app follows a **full-stack architecture** with a clear separation of concerns:
1. **Frontend**:
   - Built with **Next.js 14** (App Router) for server-side rendering and client-side interactivity.
   - Uses **React** and **TypeScript** for type-safe components.
   - Styled with **Tailwind CSS** and **shadcn/ui** for a modern, accessible UI.
   - Manages state with **TanStack Query** (via tRPC) for efficient data fetching and caching.
   - Includes a **theme toggle** for dark/light modes and a responsive layout for mobile devices.
2. **Backend**:
   - **tRPC** provides type-safe API routes for fetching available models (`models.getAvailable`), sending messages (`chat.send`), and retrieving chat history (`chat.history`).
   - **Supabase** (PostgreSQL) stores users, models, and messages with RLS policies for security.
   - **Google Gemini 2.0 Flash** is integrated via the `@google/generative-ai` package for real AI responses, with simulated responses for other models.
3. **Database**:
   - **Supabase** tables: `users` (via Supabase Auth), `models` (seeded with AI model tags), and `messages` (storing user and AI messages with timestamps).
   - RLS policies ensure users only access their own data.
4. **Authentication**:
   - **Supabase Auth** handles email/password signup, login, and session persistence across page refreshes.
5. **AI Integration**:
   - **Real integration**: Google Gemini 2.0 Flash via its API for live, intelligent responses.
   - **Simulated models**: GPT-4o, GPT-4o Mini, GPT-3.5 Turbo, Claude 3 Sonnet, and Claude 3 Haiku return mocked responses (e.g., "You said: {prompt}") but are structured for easy real API integration.
6. **Deployment**:
   - Ready for **Vercel** deployment with environment variables for Supabase and Google AI API keys.

This architecture ensures **type safety**, **scalability**, and a **great user experience**, while keeping the codebase maintainable and beginner-friendly.

---

## 🚀 Features

- 🔐 **Authentication**: Secure email/password signup and login with Supabase Auth, with session persistence across refreshes.
- 🤖 **Real AI Integration**: Live responses from Google Gemini 2.0 Flash via its API, with simulated responses for other models.
- 🎭 **Model Selection**: Dropdown to choose from multiple AI models (e.g., Gemini 2.0 Flash, GPT-4o, Claude 3 Sonnet).
- 💬 **Real-time Chat**: Message bubbles with user/AI roles, timestamps, and smooth auto-scrolling to the latest message.
- 📱 **Responsive Design**: Mobile-friendly layout with stacked chat bubbles, optimized for all screen sizes using Tailwind CSS.
- 🌙 **Dark Mode**: Toggle between light and dark themes, persisted across sessions.
- 💾 **Message Persistence**: Messages saved to Supabase with proper relationships and RLS for secure access.
- ⚡ **Type-safe API**: End-to-end type safety with tRPC for reliable communication between frontend and backend.
- 🎨 **Modern UI**: Built with shadcn/ui components for a polished, accessible interface.
- ⏳ **Loading & Typing Indicators**: Spinner during API calls and a typing indicator while the AI "thinks."
- 🚨 **Error Handling**: Graceful fallback for API failures with toast notifications for user feedback.
- ✅ **Stretch Goals**:
  - Dark/light theme toggle.
  - Typing indicator during AI responses.
  - Modern UI with shadcn/ui components.
  - Live API badge indicators for real vs. simulated models.
  - Comprehensive error handling with fallbacks.

---

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: tRPC, Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Integration**: Google Generative AI (`@google/generative-ai`) for Gemini 2.0 Flash
- **State Management**: TanStack Query (via tRPC)
- **Environment**: Node.js, npm

---

## 🎥 Demo

### Live Demo
Check out the [Loom video (3–5 min)](https://www.loom.com/share/your-loom-video-id) showcasing the app’s functionality:
- **Sign-up and login** process with Supabase Auth.
- **Model selection** via dropdown, highlighting the real Gemini 2.0 Flash integration.
- **Chat interface** with message bubbles, timestamps, auto-scrolling, and typing indicators.
- **Dark mode toggle** and responsive design on mobile.
- **Error handling** with toast notifications for API failures.
- **Code walkthrough** of key components, tRPC routers, and Supabase setup.

### Functionality Highlights
- **Authentication**: Users can sign up or log in with email/password, with sessions persisting across refreshes.
- **Model Selection**: Choose from a dropdown of AI models, with a badge indicating "Live" for Gemini and "Simulated" for others.
- **Chat Experience**: Send messages, see AI responses in real-time (Gemini) or simulated responses, with timestamps and smooth scrolling.
- **Responsive UI**: Works seamlessly on desktop and mobile, with a clean, modern look.
- **Error States**: Loading spinners and error toasts ensure a smooth user experience even if the API fails.

---

## 🏗 Project Structure

The codebase is organized into **feature-based folders** for clarity and maintainability, making it easy for beginners to navigate.

```
chat-app/
├── .env.local
├── .eslintrc.json
├── .gitignore
├── components.json
├── middleware.ts
├── next-env.d.ts
├── next.config.mjs
├── package.json
├── scripts/
│   └── supabase-schema.sql
├── src/
│   ├── app/
│   │   ├── api/trpc/[trpc]/
│   │   │   └── route.ts
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── auth/
│   │   │   └── auth-form.tsx
│   │   ├── chat/
│   │   │   ├── chat-interface.tsx
│   │   │   ├── message-bubble.tsx
│   │   │   ├── model-selector.tsx
│   │   │   └── typing-indicator.tsx
│   │   ├── ui/
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   ├── hooks/
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── supabase/
│   │   │   └── client.ts
│   │   ├── trpc/
│   │   │   ├── client.ts
│   │   │   ├── provider.tsx
│   │   │   ├── server.ts
│   │   ├── supabase.ts
│   │   ├── utils.ts
│   ├── server/
│   │   │   └── routers/
│   │   │       ├── _app.ts
│   │   │       ├── model.ts
│   │   ├── index.ts
│   │   ├── trpc.ts
│   │   └── utils/
│   ├── authUtils.ts
│   ├── trpc.ts
│   ├── withTRPC.tsx
```

### Codebase Explanation
- **Root Files**:
  - `.env.local`: Stores environment variables (e.g., Supabase and Google AI API keys).
  - `middleware.ts`: Handles server-side middleware (e.g., authentication checks).
  - `next.config.mjs`: Next.js configuration for custom settings.
  - `package.json`: Project dependencies and scripts.
- **Scripts (`scripts/`)**:
  - `supabase-schema.sql`: Contains all SQL commands to set up the Supabase database, including tables (`users`, `models`, `messages`), RLS policies, triggers, and model seeding.
- **App (`src/app/`)**:
  - `api/trpc/[trpc]/route.ts`: Handles tRPC API requests.
  - `globals.css`: Global Tailwind CSS styles.
  - `layout.tsx`: Root layout with providers (tRPC, Supabase, Theme).
  - `page.tsx`: Main chat page component.
- **Components (`src/components/`)**:
  - `auth/auth-form.tsx`: Form for signup and login, integrated with Supabase Auth.
  - `chat/`: Chat-related components:
    - `chat-interface.tsx`: Main chat window with messages and scroll.
    - `message-bubble.tsx`: Individual message component.
    - `model-selector.tsx`: Dropdown for selecting AI models.
    - `typing-indicator.tsx`: Displays a typing animation during AI responses.
  - `ui/`: Placeholder for shadcn/ui components (customize as needed).
  - `theme-provider.tsx` and `theme-toggle.tsx`: Handle dark/light mode switching.
- **Hooks (`src/hooks/`)**:
  - `use-toast.ts`: Custom hook for toast notifications.
- **Lib (`src/lib/`)**:
  - `supabase/client.ts`: Initializes the Supabase client.
  - `trpc/`: tRPC setup:
    - `client.ts`: tRPC client configuration.
    - `provider.tsx`: tRPC provider for React context.
    - `server.ts`: tRPC server setup.
    - `supabase.ts`: Supabase integration with tRPC.
    - `utils.ts`: Utility functions for tRPC.
    - `routers/`: tRPC routers:
      - `_app.ts`: Root router configuration.
      - `model.ts`: `models.getAvailable` router.
      - `index.ts`: Main router file.
      - `trpc.ts`: tRPC client utilities.
  - `utils/`: Utility functions:
    - `authUtils.ts`: Authentication-related utilities.
    - `trpc.ts`: tRPC-specific utilities.
    - `withTRPC.tsx`: HOC for tRPC integration.

The code is written with **clarity** and **modularity** in mind, using TypeScript for type safety and feature-based folders to make it easy to extend or modify.

---

## 🛠 Setup Instructions

Follow these steps to set up and run the app locally. These instructions are designed to be beginner-friendly.

### Prerequisites
- **Node.js**: Version 18 or higher
- **npm**: Comes with Node.js
- **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
- **Google AI API Key**: Get one from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Step-by-Step Setup
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/chat-app.git
   cd chat-app
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   - Create a `.env.local` file based on your Supabase and Google AI API keys:
     ```env
     # Supabase Configuration (get from Supabase dashboard)
     NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

     # Google AI API Key (get from Google AI Studio)
     GOOGLE_AI_API_KEY=your_google_ai_api_key_here
     ```
   - Update the `app.jwt_secret` in `scripts/supabase-schema.sql` with a secure JWT secret (e.g., a random string).

4. **Set Up Supabase**:
   - Create a new project in [Supabase](https://supabase.com).
   - Go to the **SQL Editor** in the Supabase dashboard and run the `scripts/supabase-schema.sql` script to:
     - Create tables (`users`, `models`, `messages`).
     - Enable and configure RLS policies.
     - Set up a trigger for new user creation.
     - Seed the `models` table with AI tags (Gemini 2.0 Flash, GPT-4o, etc.).
   - Enable **Supabase Auth** in the dashboard and configure email/password authentication.

5. **Get Google AI API Key**:
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
   - Sign in with your Google account and click "Create API Key."
   - Copy the key and add it to your `.env.local` file.

6. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   - Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deployment
To deploy on **Vercel**:
1. Push the repository to GitHub.
2. Connect the repository to Vercel via the Vercel dashboard.
3. Add the environment variables from `.env.local` to Vercel’s environment variables section.
4. Deploy the app. Vercel will handle the build and database migrations automatically.

---

## 🤖 AI Integration

### Google Gemini 2.0 Flash
- **Status**: ✅ Live API integration
- **Model**: `gemini-2.0-flash-exp`
- **Details**: Uses the `@google/generative-ai` package to fetch real-time, intelligent responses from Google’s Gemini API.
- **Error Handling**: Falls back to a simulated response ("You said: {prompt}") if the API call fails, with a toast notification for the user.

### Other Models (Simulated)
- **Models**: GPT-4o, GPT-4o Mini, GPT-3.5 Turbo, Claude 3 Sonnet, Claude 3 Haiku
- **Status**: 🔄 Simulated responses
- **Details**: Returns a mock response (e.g., "You said: {prompt}") but is structured for easy integration with real APIs (e.g., OpenAI or Anthropic) by adding API keys and updating the `lib/trpc/` logic.
- **Future Integration**:
  - Add `OPENAI_API_KEY` for GPT models.
  - Add `ANTHROPIC_API_KEY` for Claude models.

### AI Model Status Table
| Model             | Status      | API Integration          |
|-------------------|-------------|--------------------------|
| Gemini 2.0 Flash  | ✅ Live     | Google AI API            |
| GPT-4o            | 🔄 Simulated | Ready for OpenAI API     |
| GPT-4o Mini       | 🔄 Simulated | Ready for OpenAI API     |
| GPT-3.5 Turbo     | 🔄 Simulated | Ready for OpenAI API     |
| Claude 3 Sonnet   | 🔄 Simulated | Ready for Anthropic API  |
| Claude 3 Haiku    | 🔄 Simulated | Ready for Anthropic API  |

---

## 📝 Development Notes

- **Type Safety**: tRPC ensures end-to-end type safety, with TypeScript types shared between frontend and backend.
- **Performance**: TanStack Query caches API responses, reducing unnecessary requests and improving performance.
- **Accessibility**: Components include ARIA labels and keyboard navigation support for better accessibility.
- **Error Handling**: Comprehensive error handling with toast notifications and fallback responses for a smooth user experience.
- **Session Management**: Supabase Auth handles session persistence, with automatic token refresh for logged-in users.
- **Extensibility**: The codebase is modular, making it easy to add new AI models or features (e.g., message editing, tests).

### Stretch Goals Implemented
- ✅ Dark/light theme toggle with Tailwind CSS.
- ✅ Typing indicator during AI responses.
- ✅ Modern UI with shadcn/ui components.
- ✅ Live API badge indicators for real vs. simulated models.
- ✅ Graceful error handling with fallbacks and toast notifications.

### Future Improvements
- Add **message editing/deletion** as a stretch goal.
- Implement **unit tests** (Vitest) for tRPC routers and **E2E tests** (Playwright) for signup and chat flows.
- Integrate real APIs for OpenAI and Anthropic models.
- Add a **draft message indicator** using Zustand or localStorage.

---

## 🙏 Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

---

## 📜 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
