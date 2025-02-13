// We'll create our own Message type since ai/react is not available
type Message = {
  role: 'user' | 'assistant';
  content: string;
};

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // Assuming you have this utility

export function ChatMessageBubble(props: { message: Message }) {
  const isUser = props.message.role === "user";
  
  return (
    <Card
      className={cn(
        "px-4 py-3 max-w-[85%] mb-4 flex items-start gap-3",
        isUser ? "ml-auto bg-primary text-primary-foreground" : "mr-auto bg-muted",
      )}
    >
      <div className="w-6 h-6 flex items-center justify-center rounded-full shrink-0">
        {isUser ? "🧑" : "🤖"}
      </div>
      <div className="whitespace-pre-wrap break-words">
        {props.message.content}
      </div>
    </Card>
  );
}