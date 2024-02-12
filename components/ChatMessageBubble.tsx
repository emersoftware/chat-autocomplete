import type { Message } from "ai/react";

export function ChatMessageBubble(props: { message: Message}) {
  const colorClassName =
    props.message.role === "user" ? "bg-gray-900 text-white" : "bg-gray-700 text-white";
  const alignmentClassName =
    props.message.role === "user" ? "ml-auto" : "mr-auto";
  const prefix = props.message.role === "user" ? "🧑" : "🤖"
  return (
    <div
      className={`${alignmentClassName} ${colorClassName} rounded px-4 py-3 max-w-[80%] mb-4 flex`}
    >
      <div className="mr-2">
        {prefix}
      </div>
        <span>{props.message.content}</span>
    </div>
  );
}