import React, { JSX, useEffect, useState } from "react";
import Image from "next/image";
import html2canvas from "html2canvas";

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
          text: data.description.replace(/<[^>]+>/g, ""),
          url: window.location.href,
        })
        .catch((err) => console.error("Sharing failed:", err));
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  const shareAsImage = async () => {
    if (!data) return;

    // Create a simple exportable version
    const temp = document.createElement("div");
    temp.id = "temp-share";
    temp.style.position = "fixed";
    temp.style.top = "-9999px";
    temp.style.left = "-9999px";
    temp.style.width = "500px";
    temp.style.padding = "24px";
    temp.style.borderRadius = "16px";
    temp.style.backgroundColor = "#1f2937"; // bg-gray-800
    temp.style.color = "white";
    temp.style.fontFamily = "sans-serif";
    temp.style.textAlign = "center";
    temp.style.boxShadow = "0 10px 15px rgba(0,0,0,0.3)";
    temp.innerHTML = `
      <div>
        ${
          data.image
            ? `<img src="${data.image}" style="width:100%;border-radius:12px;margin-bottom:16px;" />`
            : `<div style="width:100%;height:200px;background:#444;border-radius:12px;margin-bottom:16px;"></div>`
        }
        <h2 style="font-size:24px;margin-bottom:8px;">${data.title}</h2>
        <div style="font-size:14px;">${data.description}</div>
      </div>
    `;
    document.body.appendChild(temp);

    const canvas = await html2canvas(temp, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
    });

    document.body.removeChild(temp);

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${data.title.replace(/\s+/g, "_")}_share.png`;
    link.click();
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
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-semibold text-white">{data.title}</h3>
        <p
          className="text-white"
          dangerouslySetInnerHTML={{ __html: data.description }}
        ></p>
        {data.extra && <p className="text-blue-500">{data.extra}</p>}
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={shareToSystem}
          className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
          title="Share"
        >
          Share
        </button>
        <button
          onClick={shareAsImage}
          className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700"
          title="Share to Story"
        >
          Share to Story
        </button>
      </div>
    </div>
  );
};

export default DailyCard;
