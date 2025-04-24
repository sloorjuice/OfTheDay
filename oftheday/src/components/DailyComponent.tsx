import React from "react";

interface DailyComponentProps {
  title: string;
  content: string;
  author?: string; // Optional author prop
}

export default function DailyComponent({ title, content, author }: DailyComponentProps) {
  return (
    <div className="bg-[#2c3e50] text-[#ecf0f1] p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold border-b-2 border-[#3498db] pb-2 mb-4">
        {title}
      </h2>
      <p className="text-lg">{content}</p>
      {author && (
        <p className="text-sm text-[#bdc3c7] mt-2 italic text-right">- {author}</p>
      )}
    </div>
  );
}