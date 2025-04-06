"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const ChatInput = ({
  onSend,
  disabled,
}: {
  onSend: (msg: string) => void;
  disabled: boolean;
}) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 absolute bottom-0 w-full border-t flex gap-2 bg-[#F9F9F6] rounded-b-xl"
    >
      <Input
        placeholder="Type your plant question..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        className="bg-white border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#A2B29F] focus:outline-none"
      />
      <Button
        type="submit"
        disabled={disabled}
        className="bg-gradient-to-r from-[#3C6E5F] to-[#A2B29F] text-white rounded-xl px-5 py-3 hover:from-[#2F5D50] hover:to-[#98A89E] transition-all ease-in-out"
      >
        Send
      </Button>
    </form>
  );
};
