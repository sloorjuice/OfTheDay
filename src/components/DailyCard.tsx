import React, { JSX, useEffect, useState } from "react";
import Image from "next/image";

interface DailyCardProps {
  type?: string;
  data?: {
    image?: string;
    title: string;
    description: string; // HTML string
    extra?: string | JSX.Element;
  };
}

const DailyCard: React.FC<DailyCardProps> = ({ type, data }) => {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => setWidth(window.innerWidth);
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const shareToSystem = () => {
    if (navigator.share && data) {
      navigator
        .share({
          title: data.title,
          text: `Check out "${data.title}" on OfTheDay! ${data.description.replace(/<[^>]+>/g, "")}`,
          url: window.location.href,
        })
        .catch((err) => console.error("Sharing failed:", err));
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  if (!data) {
    return (
      <div className="w-full max-w-md mx-auto p-6 rounded-lg bg-gray-100 text-gray-500 italic text-center shadow-md">
        Loading...
      </div>
    );
  }

  return (
    <div
      className={`relative w-full max-w-md mx-auto p-6 rounded-lg ${
        width && width < 768 ? "bg-gray-500" : "bg-gray-600"
      } shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg ${
        type ? `${type}-card` : ""
      }`}
    >
      {data.image ? (
        <div className="mb-4 rounded-lg overflow-hidden shadow-xl border border-gray-300">
          <Image
            src={data.image}
            alt={`${type} artwork`}
            width={500}
            height={300}
            className="w-full object-cover"
          />
        </div>
      ) : (
        <div className="mb-4 rounded-lg overflow-hidden shadow-sm bg-gray-700 flex items-center justify-center h-48">
          <span className="text-white italic">No image available</span>
        </div>
      )}

      {/* Centered text and positioned share button */}
      <div className="relative mt-4">
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-2xl font-semibold text-white text-center">
            {data.title}
          </h3>
          <p
            className="text-white text-center"
            dangerouslySetInnerHTML={{ __html: data.description }}
          ></p>
          {data.extra && (
            <p className="text-blue-500 text-center w-full">{data.extra}</p>
          )}
        </div>

        <div className="absolute left-0 bottom-0">
          <button
            onClick={shareToSystem}
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            title="Share"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyCard;
