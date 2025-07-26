# Next.js + tRPC + Supabase Chat App

A modern chat application built with Next.js, tRPC, and Supabase that allows users to chat with various AI models, including **real Google Gemini AI integration**.

## Features

- 🔐 **Authentication**: Email/password signup & login with Supabase Auth
- 🤖 **Real AI Integration**: Google Gemini 2.0 Flash with live API responses
- 🎭 **Model Selection**: Choose from multiple AI models via dropdown
- 💬 **Real-time Chat**: Message bubbles, timestamps, and smooth scrolling
- 📱 **Responsive Design**: Mobile-friendly layout with Tailwind CSS
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 💾 **Message Persistence**: All messages saved to Supabase database
- ⚡ **Type-safe API**: End-to-end type safety with tRPC
- 🎨 **Modern UI**: Built with shadcn/ui components

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: tRPC, Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Integration**: Google Generative AI (@google/generative-ai)
- **State Management**: TanStack Query (React Query)

## Quick Setup

1. **Clone and install dependencies**:
   \`\`\`bash
   git clone <your-repo-url>
   cd nextjs-trpc-supabase-chat
   npm install
   \`\`\`

2. **Set up environment variables**:
   Create \`.env.local\` from \`.env.local.example\`:
   \`\`\`env
   # Required: Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   
   # Optional: Service Role Key (for admin operations)
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   
   # Required for Gemini: Google AI API Key
   GOOGLE_AI_API_KEY=your_google_ai_api_key_here
   \`\`\`

3. **Set up Supabase**:
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL scripts in the Supabase SQL editor:
     - Execute \`scripts/01-create-tables.sql\`
     - Execute \`scripts/02-seed-models.sql\`
     - Execute \`scripts/04-simplified-rls-policies.sql\`

4. **Get Google AI API Key**:
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key
   - Add it to your \`.env.local\` file

5. **Start the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

## AI Integration

### Google Gemini (Real AI)
- **Model**: gemini-2.0-flash-exp
- **Status**: ✅ Live API integration
- **Features**: Real intelligent responses from Google's Gemini 2.0 Flash
- **Fallback**: Graceful fallback to simulated responses if API fails

### Other Models (Simulated)
- **GPT-4o, GPT-4o Mini, GPT-3.5 Turbo**: Simulated OpenAI responses
- **Claude 3 Sonnet, Claude 3 Haiku**: Simulated Anthropic responses
- **Status**: 🔄 Ready for real API integration

## Project Structure

\`\`\`
├── app/                    # Next.js App Router
│   ├── api/trpc/          # tRPC API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── chat/              # Chat interface components
│   ├── ui/                # shadcn/ui components
│   └── theme-toggle.tsx   # Dark mode toggle
├── lib/                   # Utilities and configurations
│   ├── supabase/          # Supabase client
│   └── trpc/              # tRPC setup with AI integration
└── scripts/               # Database setup scripts
\`\`\`

## Features Implemented

✅ **Core Requirements**:
- Email/password authentication with session persistence
- Model selector dropdown with multiple AI model options
- Chat UI with message bubbles, timestamps, and auto-scroll
- tRPC routers for models.getAvailable(), chat.send(), and chat.history()
- Supabase tables with proper relationships and RLS
- **Real Google Gemini AI integration**
- Loading indicators and error states
- Mobile-responsive design

✅ **Stretch Goals**:
- Dark/light theme toggle
- Typing indicator during AI responses
- Modern UI with shadcn/ui components
- Type-safe API with full TypeScript support
- **Live API badge indicators**
- **Graceful API error handling**

## AI Model Status

| Model | Status | API Integration |
|-------|--------|----------------|
| Gemini 2.0 Flash | ✅ Live | Google AI API |
| GPT-4o | 🔄 Simulated | Ready for OpenAI API |
| GPT-4o Mini | 🔄 Simulated | Ready for OpenAI API |
| GPT-3.5 Turbo | 🔄 Simulated | Ready for OpenAI API |
| Claude 3 Sonnet | 🔄 Simulated | Ready for Anthropic API |
| Claude 3 Haiku | 🔄 Simulated | Ready for Anthropic API |

## Development Notes

- **Real AI Integration**: Gemini model uses Google's live API with proper error handling
- **Session Management**: Uses Supabase Auth with automatic session refresh
- **Type Safety**: Full end-to-end type safety with tRPC and TypeScript
- **Error Handling**: Comprehensive error handling with toast notifications and API fallbacks
- **Performance**: Optimized with React Query caching and efficient re-renders
- **Accessibility**: Proper ARIA labels and keyboard navigation support

## Deployment

This app is ready to deploy on Vercel:

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables (including GOOGLE_AI_API_KEY)
4. Deploy!

The app will automatically handle database migrations and seeding through the provided SQL scripts.

## API Keys Setup

### Google AI API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add to your \`.env.local\` file

### Future API Integrations
- **OpenAI**: Add OPENAI_API_KEY for GPT models
- **Anthropic**: Add ANTHROPIC_API_KEY for Claude models
- **Others**: Easy to extend with additional AI providers