import type { Message } from "ai/react";
import { Card } from "@/components/ui/card";

export function ChatMessageBubble(props: { message: Message}) {
  const alignmentClassName =
    props.message.role === "user" ? "ml-auto" : "mr-auto";
  const prefix = props.message.role === "user" ? "🧑" : "🤖"
  return (
    <Card
      className={`${alignmentClassName} px-4 py-3 max-w-[90%] mb-4 flex`}
    >
      <div className="mr-2">
        {prefix}
      </div>
        <span>{props.message.content}</span>
    </Card>
  );
}