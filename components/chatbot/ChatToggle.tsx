"use client";

import { useState } from "react";
import { ChatBot } from "./ui";
import { Leaf } from "lucide-react"; // You can replace with your custom logo if needed
import { cn } from "@/lib/utils";

export default function ChatToggle() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {open && <ChatBot onClose={() => setOpen(false)} />}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-all duration-300",
          "bg-gradient-to-br from-[#A2B29F] to-[#3C6E5F] hover:scale-105 hover:shadow-lg animate-pulse-slow"
        )}
        aria-label="Toggle ChatBot"
      >
        <Leaf className="text-white w-6 h-6" />
      </button>
    </div>
  );
}
