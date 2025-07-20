"use client";
import React, { useEffect, useState } from "react";
import SurveyThermometer from "./surveyThermometer";
import { fetchSurveyData, SurveyData } from "./surveyData";
import QRCode from "@/public/images/mood-tracker/QRCode2Dark.png";
import QRCodeL from "@/public/images/mood-tracker/QRCode2Light.png";
import Image from "next/image";

const Page = () => {
  const [surveyData, setSurveyData] = useState<SurveyData>({
    happy: 0,
    hopeful: 0,
    pleasant: 0,
    anxious: 0,
    frustrated: 0,
    sad: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSurveyData();
        setSurveyData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch survey data. Please try again later.");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-7xl font-redhat font-bold mb-3 text-white py-7">
        Live <span className="text-orange-400">Mood</span> Tracker
      </h1>
      <div className="flex m-7 justify-center items-center">
        <div className="bg-slate-200 rounded-lg shadow-xl p-8 max-w-[75%] w-full mb-7">
          <div className="flex items-center justify-center mb-6">
            {/* <CloudRain className="w-12 h-12 text-blue-500 mr-4" /> */}
            <h2 className="text-8xl font-redhat font-semibold text-gray-700">
              How are you feeling today?
            </h2>
          </div>
          {error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <SurveyThermometer data={surveyData} />
          )}
        </div>
        <div className="m-7 text-center items-center justify-center w-[20%]">
          <h1 className="text-6xl font-redhat font-bold mb-9 text-white">
            Scan this link <span className="text-orange-400">HERE</span> for
            your response:
          </h1>
          <div className=" flex flex-row justify-center whitespace-nowrap">
            <Image
              className=""
              src={QRCode}
              alt="QR Code to Respond"
              width={300}
              height={300}
            />
          </div>
          <h1 className="text-4xl font-redhat font-bold mt-7 text-white">
            <span className="text-orange-400">Follow us on Instagram</span>:
          </h1>
          <h1 className="text-7xl font-redhat font-bold mt-7 text-white">
            @dsmlc.uofc
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Page;
