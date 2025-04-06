"use client";

export const ChatMessage = ({
  role,
  content,
}: {
  role: "user" | "bot";
  content: string;
}) => {
  return (
    <div
      className={`p-3 rounded-lg max-w-[75%] ${
        role === "user"
          ? "bg-blue-100 ml-auto text-right"
          : "bg-green-100 mr-auto"
      }`}
    >
      {content}
    </div>
  );
};
