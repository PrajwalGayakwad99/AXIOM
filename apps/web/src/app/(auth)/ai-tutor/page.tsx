"use client";

import { AITutorChat } from "@/components/ai/ai-tutor-chat";

export default function AITutorPage() {
  return (
    <div className="h-[calc(100vh-3.5rem-3rem)] flex">
      {/* Main Chat */}
      <div className="flex-1 glass-card overflow-hidden flex flex-col">
        <AITutorChat />
      </div>
    </div>
  );
}
