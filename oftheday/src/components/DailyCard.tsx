import React from "react";

interface DailyCardProps {
  type?: string;
  data?: {
    image?: string;
    title: string;
    description: string;
    extra?: string;
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
      className={`w-full max-w-md mx-auto p-6 rounded-lg bg-white shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg ${
        type ? `${type}-card` : ""
      }`}
    >
      {data.image && (
        <div className="mb-4 rounded-lg overflow-hidden shadow-sm">
          <img
            src={data.image}
            alt={`${type} artwork`}
            className="w-full object-cover"
          />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-semibold text-gray-800">{data.title}</h3>
        <p className="text-gray-600">{data.description}</p>
        {data.extra && <p className="text-gray-500">{data.extra}</p>}
      </div>
    </div>
  );
};

export default DailyCard;