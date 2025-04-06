"use client";
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

const removeSpecialCharacters = (text: string) => {
  return text.replace(/[*_]/g, "");
};

export const ChatBot = ({ onClose }: { onClose: () => void }) => {
  // Initial bot message with a natural greeting
  const initialContext = `
    Hello! 🌱 I'm Urban PlantationExpert, your personal assistant for everything related to urban gardening. 
    I am here to help you with:
    - Caring for your indoor and outdoor plants.
    - Tips on creating a sustainable urban garden.
    - Identifying and solving plant problems.
    - Providing guidance on urban farming, including planting vegetables, flowers, and herbs.
    - Helping you choose the right plants for your space and climate.
    
    I can guide you with actionable tips, best practices, and answers to your gardening questions. Just ask away, and I’ll help you grow your green space! 🌿
  `;

  const [messages, setMessages] = useState([
    { role: "bot", content: initialContext },
  ]);
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState(initialContext); // To track the conversation context

  const handleSend = async (userMessage: string) => {
    // 1. Add the user's message to the chat (it will be printed even if it's irrelevant)
    const isRelevantMessage = checkRelevance(userMessage);

    // Add the user's message to the chat, regardless of relevance
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);
    setContext((prev) => prev + " " + userMessage); // Update context with the user's message
   
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          context: context,
          systemInstructions: `You are a helpful assistant. Respond in very short and clear format. typically the response should be 3-4 pointers max and each pointer should be max of 1-2 line . Use bullet points. Do not include any introductory or concluding sentences. List each point as a separate bullet point. Do not use markdown symbols like **, *, or _.\n Example Response:\n - Point 1\n - Point 2\n - Point 3`,
        }),
      });

      const { reply } = await res.json();

      // 2. Format the bot's response and add it to the chat
      const formattedReply = formatBotResponse(reply);

      setMessages((prev) => [
        ...prev,
        { role: "bot", content: formattedReply },
      ]);
      setContext((prev) => prev + " " + formattedReply); // Update context with the bot's reply
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "Something went wrong. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Function to check if the user's message is relevant to urban gardening
  const checkRelevance = (message: string) => {
    const relevantKeywords = [
      "plant care",
      "gardening",
      "urban garden",
      "sustainability",
      "soil",
      "pest control",
      "composting",
      "irrigation",
      "watering",
      "indoor plants",
      "outdoor plants",
      "plant diseases",
      "compost",
      "fertilization",
      "planting",
      "hydroponics",
      "plant nutrition",
      "pruning",
      "vegetables",
      "flowers",
      "herbs",
      "gardening tips",
    ];

    return relevantKeywords.some((keyword) =>
      message.toLowerCase().includes(keyword)
    );
  };

  // Function to format bot's response into short, structured points
  const formatBotResponse = (response: string) => {
    // Split the response into sentences and break them into structured points
    const sentences = response.split(". ");
    const formattedResponse = sentences
      .map((sentence, idx) => {
        return removeSpecialCharacters(sentence); // First sentence is the intro or summary.
      })
      .join(" ");

    return formattedResponse;
  };

  return (
    <Card className="max-w-2xl bg-white mx-auto flex flex-col h-[80vh]">
      <CardHeader className="text-xl font-semibold">
        🌿 Urban PlantationExpert ChatBot
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg max-w-full ${
              msg.role === "bot"
                ? "bg-green-100 text-green-800 text-left"
                : "bg-blue-100 text-blue-800 text-right"
            }`}
          >
            <p className="whitespace-pre-line">{msg.content}</p>
          </div>
        ))}
      </CardContent>
      <ChatInput onSend={handleSend} disabled={loading} />
    </Card>
  );
};
