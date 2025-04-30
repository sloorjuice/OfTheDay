"use client";
import React, { useState } from "react";

interface JokeComponentProps {
  setup: string;
  punchline: string;
  category: string;
}

export default function JokeComponent({ setup, punchline, category }: JokeComponentProps) {
  const [showPunchline, setShowPunchline] = useState(false);

  return (
    <div className="bg-[#2c3e50] text-[#ecf0f1] p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold border-b-2 border-[#e67e22] pb-2 mb-4">
        Joke of the Day ({category})
      </h2>
      <p className="text-lg mb-4">{setup}</p>
      {!showPunchline ? (
        <button
          onClick={() => setShowPunchline(true)}
          className="bg-[#e67e22] text-white px-4 py-2 rounded hover:bg-orange-500 transition"
        >
          Reveal Punchline
        </button>
      ) : (
        <p className="text-lg font-semibold mt-2">{punchline}</p>
      )}
    </div>
  );
}
