// PATH: src/types/index.ts
// All shared TypeScript interfaces & Zod schemas for CodeVision AI

import { z } from "zod";

// ─────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────

export const RoleEnum = z.enum(["STUDENT", "TEACHER", "ADMIN"]);
export type Role = z.infer<typeof RoleEnum>;

export const DifficultyEnum = z.enum(["EASY", "MEDIUM", "HARD"]);
export type Difficulty = z.infer<typeof DifficultyEnum>;

export const SubmissionStatusEnum = z.enum(["PASSED", "FAILED", "PENDING"]);
export type SubmissionStatus = z.infer<typeof SubmissionStatusEnum>;

export const SubscriptionPlanEnum = z.enum(["FREE", "PRO", "ENTERPRISE"]);
export type SubscriptionPlan = z.infer<typeof SubscriptionPlanEnum>;

export const SubscriptionStatusEnum = z.enum(["ACTIVE", "CANCELED", "PAST_DUE"]);
export type SubscriptionStatusType = z.infer<typeof SubscriptionStatusEnum>;

export const NotificationTypeEnum = z.enum(["SYSTEM", "ACHIEVEMENT", "MESSAGE", "CHALLENGE", "XP"]);
export type NotificationType = z.infer<typeof NotificationTypeEnum>;

// ─────────────────────────────────────────────
// User & Profile
// ─────────────────────────────────────────────

export const ProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  bio: z.string().nullable().optional(),
  github: z.string().nullable().optional(),
  portfolioUrl: z.string().url().nullable().optional(),
  careerScore: z.number().int().default(0),
  totalXp: z.number().int().default(0),
  streakDays: z.number().int().default(0),
});
export type Profile = z.infer<typeof ProfileSchema>;

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().nullable().optional(),
  email: z.string().email(),
  emailVerified: z.string().datetime().nullable().optional(),
  image: z.string().url().nullable().optional(),
  role: RoleEnum.default("STUDENT"),
  twoFactorEnabled: z.boolean().default(false),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  profile: ProfileSchema.nullable().optional(),
});
export type User = z.infer<typeof UserSchema>;

/** Lightweight user for lists, leaderboards, chat bubbles */
export interface UserSummary {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: Role;
}

// ─────────────────────────────────────────────
// Course / Topic / Lesson
// ─────────────────────────────────────────────

export const LessonSchema = z.object({
  id: z.string(),
  topicId: z.string(),
  content: z.string(),
  codeExample: z.string().nullable().optional(),
  visualizationData: z.any().nullable().optional(),
});
export type Lesson = z.infer<typeof LessonSchema>;

export const TopicSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  title: z.string(),
  order: z.number().int(),
  prerequisites: z.array(z.string()).default([]),
  lessons: z.array(LessonSchema).optional(),
});
export type Topic = z.infer<typeof TopicSchema>;

export const CourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  authorId: z.string(),
  isPublished: z.boolean().default(false),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  topics: z.array(TopicSchema).optional(),
});
export type Course = z.infer<typeof CourseSchema>;

// ─────────────────────────────────────────────
// Challenge & Submission
// ─────────────────────────────────────────────

export const TestCaseSchema = z.object({
  input: z.string(),
  expectedOutput: z.string(),
});
export type TestCase = z.infer<typeof TestCaseSchema>;

export const ChallengeSchema = z.object({
  id: z.string(),
  title: z.string(),
  difficulty: DifficultyEnum,
  starterCode: z.string().nullable().optional(),
  testCases: z.array(TestCaseSchema).default([]),
  xpReward: z.number().int().default(10),
  tags: z.array(z.string()).optional(),
});
export type Challenge = z.infer<typeof ChallengeSchema>;

export const SubmissionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  challengeId: z.string(),
  code: z.string(),
  status: SubmissionStatusEnum,
  score: z.number().int().default(0),
  createdAt: z.string().datetime().optional(),
});
export type Submission = z.infer<typeof SubmissionSchema>;

// ─────────────────────────────────────────────
// Code Execution
// ─────────────────────────────────────────────

export const SupportedLanguageEnum = z.enum([
  "python",
  "javascript",
  "typescript",
  "java",
  "cpp",
  "c",
  "go",
  "rust",
]);
export type SupportedLanguage = z.infer<typeof SupportedLanguageEnum>;

export const CodeExecutionRequestSchema = z.object({
  code: z.string().min(1, "Code cannot be empty"),
  language: SupportedLanguageEnum,
});
export type CodeExecutionRequest = z.infer<typeof CodeExecutionRequestSchema>;

export const CodeExecutionResponseSchema = z.object({
  output: z.string(),
  executionTime: z.number().optional(),
  status: z.enum(["success", "error", "simulated"]).optional(),
  error: z.string().optional(),
});
export type CodeExecutionResponse = z.infer<typeof CodeExecutionResponseSchema>;

// ─────────────────────────────────────────────
// AI / Chat
// ─────────────────────────────────────────────

export const AIMessageRoleEnum = z.enum(["user", "assistant", "system"]);
export type AIMessageRole = z.infer<typeof AIMessageRoleEnum>;

export const AIMessageSchema = z.object({
  role: AIMessageRoleEnum,
  content: z.string(),
  timestamp: z.string().datetime().optional(),
});
export type AIMessage = z.infer<typeof AIMessageSchema>;

export const AIChatRequestSchema = z.object({
  messages: z.array(AIMessageSchema),
  context: z.string().optional(),
  model: z.string().optional(),
});
export type AIChatRequest = z.infer<typeof AIChatRequestSchema>;

export const AIChatResponseSchema = z.object({
  content: z.string(),
  model: z.string().optional(),
  tokensUsed: z.number().optional(),
  error: z.string().optional(),
});
export type AIChatResponse = z.infer<typeof AIChatResponseSchema>;

export const AICodeAnalysisSchema = z.object({
  bugs: z.array(z.object({
    line: z.number().optional(),
    severity: z.enum(["warning", "error", "info"]),
    message: z.string(),
    suggestion: z.string().optional(),
  })),
  suggestions: z.array(z.string()),
  complexityScore: z.number().min(0).max(100),
  summary: z.string(),
});
export type AICodeAnalysis = z.infer<typeof AICodeAnalysisSchema>;

export const AIQuizQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).min(2).max(6),
  correctIndex: z.number().int(),
  explanation: z.string().optional(),
});
export type AIQuizQuestion = z.infer<typeof AIQuizQuestionSchema>;

export const AIQuizSchema = z.object({
  topic: z.string(),
  questions: z.array(AIQuizQuestionSchema),
});
export type AIQuiz = z.infer<typeof AIQuizSchema>;

export const AIHintSchema = z.object({
  hint: z.string(),
  level: z.number().int().min(1).max(3), // 1=vague, 2=medium, 3=specific
});
export type AIHint = z.infer<typeof AIHintSchema>;

// ─────────────────────────────────────────────
// AI Conversation (persistent)
// ─────────────────────────────────────────────

export interface AIConversation {
  id: string;
  userId: string;
  messages: AIMessage[];
  context: string | null;
  model: string;
  tokensUsed: number;
  createdAt: string;
}

// ─────────────────────────────────────────────
// Gamification
// ─────────────────────────────────────────────

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  earnedAt: string;
  achievement?: Achievement;
}

export interface XPTransaction {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: UserSummary;
  totalXp: number;
  streakDays: number;
  challengesSolved: number;
}

// ─────────────────────────────────────────────
// Study Groups & Messages
// ─────────────────────────────────────────────

export interface StudyGroup {
  id: string;
  name: string;
  ownerId: string;
  owner?: UserSummary;
  members?: UserSummary[];
  memberCount?: number;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  userId: string;
  user?: UserSummary;
  content: string;
  createdAt: string;
}

// ─────────────────────────────────────────────
// Forum
// ─────────────────────────────────────────────

export interface ForumPost {
  id: string;
  userId: string;
  user?: UserSummary;
  title: string;
  content: string;
  tags: string[];
  upvotes: number;
  replyCount?: number;
  createdAt: string;
}

export interface ForumReply {
  id: string;
  postId: string;
  userId: string | null;
  user?: UserSummary | null;
  content: string;
  isAIGenerated: boolean;
  createdAt: string;
}

// ─────────────────────────────────────────────
// Portfolio
// ─────────────────────────────────────────────

export interface PortfolioProject {
  id: string;
  userId: string;
  title: string;
  description: string;
  repoUrl: string | null;
  demoUrl: string | null;
  createdAt: string;
}

// ─────────────────────────────────────────────
// Notifications
// ─────────────────────────────────────────────

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
}



// ─────────────────────────────────────────────
// Subscription
// ─────────────────────────────────────────────

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatusType;
  expiresAt: string | null;
  createdAt: string;
}

// ─────────────────────────────────────────────
// Form Schemas (for react-hook-form + zod)
// ─────────────────────────────────────────────

export const LoginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type LoginFormData = z.infer<typeof LoginFormSchema>;

export const RegisterFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  confirmPassword: z.string(),
  role: RoleEnum,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
export type RegisterFormData = z.infer<typeof RegisterFormSchema>;

export const ForgotPasswordFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});
export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordFormSchema>;

export const ProfileSettingsFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
  github: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  portfolioUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  twoFactorEnabled: z.boolean().default(false),
});
export type ProfileSettingsFormData = z.infer<typeof ProfileSettingsFormSchema>;

export const CreateChallengeFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  difficulty: DifficultyEnum,
  starterCode: z.string().optional(),
  testCases: z.array(TestCaseSchema).min(1, "At least one test case required"),
  xpReward: z.number().int().min(1).max(1000).default(10),
});
export type CreateChallengeFormData = z.infer<typeof CreateChallengeFormSchema>;

export const CreateForumPostFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  tags: z.array(z.string()).max(5, "Maximum 5 tags").default([]),
});
export type CreateForumPostFormData = z.infer<typeof CreateForumPostFormSchema>;

export const CreateGroupFormSchema = z.object({
  name: z.string().min(3, "Group name must be at least 3 characters"),
});
export type CreateGroupFormData = z.infer<typeof CreateGroupFormSchema>;

// ─────────────────────────────────────────────
// Editor Config
// ─────────────────────────────────────────────

export interface EditorConfig {
  language: SupportedLanguage;
  theme: "vs-dark" | "github-dark" | "monokai";
  fontSize: number;
  tabSize: number;
  vimMode: boolean;
  minimap: boolean;
  wordWrap: "on" | "off" | "wordWrapColumn";
  lineNumbers: "on" | "off" | "relative";
}

export const DEFAULT_EDITOR_CONFIG: EditorConfig = {
  language: "python",
  theme: "vs-dark",
  fontSize: 14,
  tabSize: 4,
  vimMode: false,
  minimap: false,
  wordWrap: "on",
  lineNumbers: "on",
};

// ─────────────────────────────────────────────
// Dashboard Stats
// ─────────────────────────────────────────────

export interface DashboardStats {
  totalXp: number;
  streakDays: number;
  challengesSolved: number;
  coursesInProgress: number;
  rank: number;
  recentAchievements: UserAchievement[];
  recentSubmissions: Submission[];
  xpHistory: { date: string; amount: number }[];
}

// ─────────────────────────────────────────────
// Teacher Analytics
// ─────────────────────────────────────────────

export interface TeacherAnalytics {
  totalStudents: number;
  averageScore: number;
  submissionsToday: number;
  courseCompletionRate: number;
  topStudents: LeaderboardEntry[];
  submissionTrend: { date: string; count: number }[];
}

// ─────────────────────────────────────────────
// Admin Metrics
// ─────────────────────────────────────────────

export interface AdminMetrics {
  totalUsers: number;
  activeToday: number;
  totalCourses: number;
  totalChallenges: number;
  flaggedPosts: number;
  revenue: number;
  userGrowth: { date: string; count: number }[];
  roleDistribution: { role: Role; count: number }[];
}

// ─────────────────────────────────────────────
// API Response helpers
// ─────────────────────────────────────────────

export interface APIResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
