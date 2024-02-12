"use client";

import { useChat } from "ai/react";
import { useRef, useState, ReactElement } from "react";
import type { FormEvent } from "react";
import type { AgentStep } from "langchain/schema";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ChatMessageBubble } from "@/components/ChatMessageBubble";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  const endpoint = "api/chat";
  const placeholder = "Pregunta";

  const { toast } = useToast();

  const { messages, input, setInput, handleInputChange, handleSubmit, isLoading: chatEndpointIsLoading, setMessages } =
    useChat({
      api: endpoint,
      onResponse(response) {
        const sourcesHeader = response.headers.get("x-sources");
        const sources = sourcesHeader ? JSON.parse((Buffer.from(sourcesHeader, 'base64')).toString('utf8')) : [];
        const messageIndexHeader = response.headers.get("x-message-index");
      },
      onError: (e) => {
        toast({ title: "Error", description: e.message });
      }
    });

  async function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!messages.length) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    if (chatEndpointIsLoading) {
      return;
    }

    handleSubmit(e);

  }
  
  return (
    <main className="w-full lg:w-1/2 h-screen mx-auto text-white flex flex-col items-center justify-between p-24">
      <h2 className={`text-3xl mb-8`}> Chat Suggest Autocomplete</h2>

      <ScrollArea
        className="h-full w-full mb-4"
      >
        {messages.length > 0 ? (
          [...messages]
            .map((m, i) => {
              return <ChatMessageBubble key={m.id} message={m}></ChatMessageBubble>;
            })
        ) : (
          ""
        )}
      </ScrollArea>

      <form onSubmit={sendMessage} className="flex w-full flex-col">
        <div className="flex flex-col space-y-2 w-full mt-2">
          <Textarea
            className="text-black"
            value={input}
            placeholder={placeholder}
            onChange={handleInputChange}
          />
          <Button type="submit" className="">
            <div role="status" className={`${chatEndpointIsLoading ? "" : "hidden"} flex justify-center`}>
              <svg aria-hidden="true" className="w-6 h-6 text-white animate-spin fill-black" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
            <span className={chatEndpointIsLoading ? "hidden" : ""}>Enviar</span>
          </Button>
        </div>
      </form>
      <Toaster />
    </main>
  );
}
