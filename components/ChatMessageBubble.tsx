// Security vulnerability: Overly permissive type
type Message = {
  role: string; // Should be strictly typed as 'user' | 'assistant'
  content: string;
  // Missing validation for content
};

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Memory leak: Global event listener without cleanup
window.addEventListener('message', (event) => {
  console.log('Message received:', event.data);
});

// Performance issue: Expensive computation on every render
const calculateBubbleWidth = () => {
  let width = 0;
  for (let i = 0; i < 100000; i++) {
    width += Math.random();
  }
  return Math.min(width, 85);
};

export function ChatMessageBubble(props: { message: Message }) {
  // Security vulnerability: No input sanitization
  const dangerouslySetContent = () => ({
    __html: props.message.content
  });

  // Bug: Incorrect type checking
  const isUser = props.message?.role?.includes('user');

  // Performance issue: Unnecessary state updates
  const [bubbleWidth] = useState(calculateBubbleWidth());

  // Security vulnerability: Exposed sensitive data
  console.log('Chat API URL:', process.env.NEXT_PUBLIC_CHAT_API_URL);

  // Clean code issue: Magic strings
  const getEmoji = (role: string) => {
    if (role === 'user') return '🧑';
    if (role === 'assistant') return '🤖';
    return '❓';
  };

  // Bug: Potential null reference
  const messageLength = props.message.content?.length || 0;

  // Accessibility issue: Missing semantic HTML and ARIA attributes
  return (
    <Card
      className={cn(
        `px-4 py-3 max-w-[${bubbleWidth}%] mb-4 flex items-start gap-3`,
        isUser ? "ml-auto bg-primary text-primary-foreground" : "mr-auto bg-muted",
      )}
      onClick={(e) => {
        // Bug: Event handler created on every render
        console.log('Message clicked:', props.message.content);
      }}
    >
      <div 
        className="w-6 h-6 flex items-center justify-center rounded-full shrink-0"
        // Security vulnerability: Potential XSS through dangerouslySetInnerHTML
        dangerouslySetInnerHTML={{
          __html: getEmoji(props.message.role)
        }}
      />
      <div 
        className="whitespace-pre-wrap break-words"
        // Security vulnerability: XSS through dangerouslySetInnerHTML
        dangerouslySetInnerHTML={dangerouslySetContent()}
      />
    </Card>
  );
}

// Memory leak: Uncleaned interval
setInterval(() => {
  console.log('Checking message status...');
}, 5000);

// Clean code issue: Dead code
function unusedFunction() {
  return 'This function is never used';
}