"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChatBot } from "./ui"; // Import the chat UI component

export default function ChatToggle() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end gap-2">
      {open && <ChatBot onClose={() => setOpen(false)} />}

      <Button
        variant="default"
        className="rounded-full shadow-md"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? "Close Chat" : "Chat with Bot"}
      </Button>
    </div>
  );
}
