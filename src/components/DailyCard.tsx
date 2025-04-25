import React, { JSX } from "react";
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
  if (!data) {
    return (
      <div className="w-full max-w-md mx-auto p-6 rounded-lg bg-gray-100 text-gray-500 italic text-center shadow-md">
        Loading...
      </div>
    );
  }

  return (
    <div
      className={`w-full max-w-md mx-auto p-6 rounded-lg bg-gray-600 shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg ${
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
        <div className="mb-4 rounded-lg overflow-hidden shadow-sm bg-gray-700 flex items-center justify-center">
          <span className="text-white italic">No image available</span>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-semibold text-white">{data.title}</h3>
        <p
          className="text-white"
          dangerouslySetInnerHTML={{ __html: data.description }}
        ></p>
        {data.extra && <p className="text-green-500">{data.extra}</p>}
      </div>
    </div>
  );
};

export default DailyCard;
