"use client";
import React, { useEffect, useState } from "react";
import SurveyThermometer from "./surveyThermometer";
import { fetchSurveyData, SurveyData } from "./surveyData";
import QRCodeDark from "@/public/images/mood-tracker/QRCode2Dark.png";
import QRCodeLight from "@/public/images/mood-tracker/QRCode2Light.png";
import Image from "next/image";
import { useTheme } from "@/app/ThemeProvider";

const Page = () => {
  const { isDarkMode } = useTheme();

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
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const qrSrc = isDarkMode ? QRCodeDark : QRCodeLight;

  return (
    <div className="min-h-screen bg-transparent px-3 sm:px-6 py-6">
      <div className="mx-auto w-full max-w-6xl rounded-2xl bg-zinc-900 border border-orange-400/50">
        <div className="p-4 sm:p-6">
          <h1
            className="
              font-redhat font-bold mb-4 py-2 text-center text-white leading-tight
              text-[clamp(1.75rem,5vw,4.5rem)]
              mx-auto max-w-[70ch]
              break-words whitespace-normal [hyphens:auto]
              [text-wrap:balance]
            "
          >
            Live <span className="text-orange-400">Mood</span> Tracker
          </h1>

          <div
            className="
              grid gap-6 md:gap-8 md:grid-cols-3 items-start
              [&>*]:min-w-0
            "
          >
            <div className="md:col-span-2 min-w-0">
              <div className="w-full bg-slate-200 rounded-xl md:rounded-2xl shadow-xl border border-zinc-300 p-4 sm:p-6 md:p-8">
                <div className="flex items-center justify-center mb-4 sm:mb-6">
                  <h2
                    className="
                      font-redhat font-semibold text-gray-700 text-center
                      text-[clamp(1.125rem,3.25vw,3rem)] leading-snug
                      mx-auto max-w-[68ch]
                      break-words whitespace-normal [hyphens:auto]
                      [text-wrap:balance]
                    "
                  >
                    How are WE feeling today?
                  </h2>
                </div>

                <div className="relative w-full">
                  <div className="min-h-[220px] sm:min-h-[280px] md:min-h-[340px] lg:min-h-[420px]">
                    <div
                      className="
                        h-full w-full overflow-x-auto overflow-y-hidden
                        [contain:layout_paint_style]
                      "
                    >
                      {error ? (
                        <p
                          className="
                            text-center text-red-700
                            text-sm sm:text-base
                            mx-auto max-w-[70ch]
                            break-words whitespace-normal [hyphens:auto]
                          "
                        >
                          {error}
                        </p>
                      ) : (
                        <div className="h-full w-full min-w-0">
                          <SurveyThermometer data={surveyData} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-1 min-w-0">
              <div className="text-center flex flex-col items-center justify-start h-full">
                <h3
                  className="
                    font-redhat font-bold mb-4 sm:mb-6 text-white
                    text-[clamp(1.125rem,2.5vw,2rem)] leading-snug
                    mx-auto max-w-[60ch]
                    break-words whitespace-normal [hyphens:auto]
                    [text-wrap:balance]
                  "
                >
                  Scan this link <span className="text-orange-400">HERE</span>{" "}
                  for your response:
                </h3>

                <div className="relative mx-auto aspect-square w-40 sm:w-56 md:w-64 lg:w-72">
                  <Image
                    src={qrSrc}
                    alt="QR Code to respond"
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 10rem, (max-width: 768px) 14rem, (max-width: 1024px) 16rem, 18rem"
                    priority
                  />
                </div>

                <h4
                  className="
                    font-redhat font-bold mt-6 sm:mt-7 text-white
                    text-[clamp(1rem,2vw,1.5rem)]
                    mx-auto max-w-[60ch]
                    break-words whitespace-normal [hyphens:auto]
                    [text-wrap:balance]
                  "
                >
                  <span className="text-orange-400">
                    Follow us on Instagram
                  </span>
                  :
                </h4>
                <p
                  className="
                    font-redhat font-bold mt-3 sm:mt-4 text-white
                    text-[clamp(1.75rem,4vw,3rem)]
                    mx-auto max-w-[30ch]
                    break-words whitespace-normal [hyphens:auto]
                    [text-wrap:balance]
                  "
                >
                  @dsmlc.uofc
                </p>
              </div>
            </div>
          </div>
          <div className="h-2 sm:h-4" />
        </div>
      </div>
    </div>
  );
};

export default Page;
