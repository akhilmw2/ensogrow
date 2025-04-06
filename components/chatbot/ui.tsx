"use client";
import { X } from "lucide-react";
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ChatInput } from "./ChatInput";

const removeSpecialCharacters = (text: string) => {
  return text.replace(/[*_]/g, "");
};

export const ChatBot = ({ onClose }: { onClose: () => void }) => {
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
  const [context, setContext] = useState(initialContext);

  const handleSend = async (userMessage: string) => {
    const isRelevantMessage = checkRelevance(userMessage);

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);
    setContext((prev) => prev + " " + userMessage);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          context: context,
          systemInstructions: `You are a helpful assistant. Respond in very short and clear format. Typically, the response should be 3-4 pointers max, each with a maximum of 1-2 lines. Use bullet points. Do not include introductory or concluding sentences.`,
        }),
      });

      const { reply } = await res.json();

      const formattedReply = formatBotResponse(reply);

      setMessages((prev) => [
        ...prev,
        { role: "bot", content: formattedReply },
      ]);
      setContext((prev) => prev + " " + formattedReply);
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

  const formatBotResponse = (response: string) => {
    const sentences = response.split(". ");
    const formattedResponse = sentences
      .map((sentence, idx) => {
        return removeSpecialCharacters(sentence);
      })
      .join(" ");

    return formattedResponse;
  };

  return (
    <Card
      className="fixed bottom-20 right-4 left-4 md:left-auto md:right-4 max-w-2xl bg-white shadow-xl rounded-tl-2xl rounded-tr-2xl flex flex-col h-[80vh]"
      style={{ marginBottom: "20px" }} // pulls the chat up above the leaf button
    >
      {/* Fixed Header */}
      <div className="bg-gradient-to-r from-[#a3b18a] to-[#588157] w-full text-white flex items-center rounded-t-2xl justify-between p-4 absolute top-0 z-10">
        <h2 className="text-lg font-semibold w-full text-center">
          🌿 GrowMate Assistant
        </h2>
        <button
          onClick={onClose}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200"
          aria-label="Close Chat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 px-4 py-5 mt-8 mb-10 bg-white">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl max-w-full ${
              msg.role === "bot"
                ? "bg-green-100 text-green-800 text-left"
                : "bg-blue-100 text-blue-800 text-right"
            }`}
          >
            <p className="whitespace-pre-line">{msg.content}</p>
          </div>
        ))}
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={loading} />
    </Card>
  );
};
