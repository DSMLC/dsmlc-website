import React, { useState, useEffect } from "react";
import { SurveyData } from "./surveyData";

interface SurveyThermometerProps {
  data: SurveyData;
}

const SurveyThermometer: React.FC<SurveyThermometerProps> = ({ data }) => {
  const [animate, setAnimate] = useState(false);
  const totalVotes = Object.values(data).reduce((sum, value) => sum + value, 0);
  // const maxHeight = 300; // pixels

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 4000);
    return () => clearTimeout(timer);
  }, [data]);

  // const calculateHeight = (value: number) => {
  //   return totalVotes === 0 ? maxHeight / Object.keys(data).length : (value / totalVotes) * maxHeight;
  // };

  const getColor = (key: keyof SurveyData) => {
    const colors: Record<keyof SurveyData, string> = {
      happy: "bg-yellow-300",
      hopeful: "bg-green-400",
      pleasant: "bg-cyan-300",
      anxious: "bg-orange-400",
      frustrated: "bg-pink-300",
      sad: "bg-blue-500",

      // thriving: 'bg-yellow-400',
      // gliding: 'bg-green-400',
      // surviving: 'bg-blue-400',
      // fluctuating: 'bg-purple-400',
      // struggling: 'bg-orange-400',
      // sinking: 'bg-red-400',
    };
    return colors[key];
  };

  const sortedData = Object.entries(data).sort(([, a], [, b]) => b - a);
  const notSortedData = Object.entries(data);

  return (
    // <div className="flex items-center space-x-8">
    //   <div className="relative w-24 h-[320px]">
    //     <div className="absolute top-0 left-0 right-0 h-full bg-gray-200 rounded-full overflow-hidden border-4 border-gray-300">
    //       {sortedData.map(([key, value], index) => (
    //         <div
    //           key={key}
    //           className={`absolute bottom-0 left-0 right-0 transition-all duration-500 ease-in-out ${getColor(key as keyof SurveyData)}`}
    //           style={{
    //             height: `${calculateHeight(value)}px`,
    //             bottom: `${sortedData.slice(index + 1).reduce((sum, [, v]) => sum + calculateHeight(v), 0)}px`,
    //           }}
    //         ></div>
    //       ))}
    //     </div>
    //     <div
    //       className={`absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-blue-500 rounded-full transition-all duration-500 ${
    //         animate ? 'animate-raindrop' : ''
    //       }`}
    //     ></div>
    //   </div>
    //   <div className="flex flex-col justify-between h-[320px] text-sm font-semibold">
    //     {sortedData.map(([key, value]) => (
    //       <div key={key} className="flex items-center space-x-2">
    //         <div className={`w-4 h-4 rounded-full ${getColor(key as keyof SurveyData)}`}></div>
    //         <span className="text-gray-700 capitalize">{key}</span>
    //         <span className="text-gray-500 ml-2">({value})</span>
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <div className="flex flex-col items-center bg-">
      <div
        className={`bg-orange-400 w-0 h-4 top-0 ${
          animate ? "animate-load" : " "
        }`}
      ></div>
      <div
        id="votes_bar"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 p-5 bg-black w-full rounded-lg place-items-center"
      >
        {sortedData.map(
          ([key, value], index) =>
            value !== 0 && (
              <div
                key={key}
                style={{ flex: value }}
                className={`flex flex-col text-xl justify-center items-center w-[100%] text-white font-bold font-redhat p-3 transition-all duration-500 ease-in-out ${getColor(
                  key as keyof SurveyData
                )}`}
              >
                <div>{key}</div>
                <div className="text-xl">{value}</div>
              </div>
            )
        )}
      </div>
      <div
        id="votes_display"
        className="w-[100%] mt-7 rounded-lg flex flex-wrap"
      >
        {notSortedData.map(([key, value], index) => (
          <div
            key={key}
            className={`flex flex-col justify-center items-center w-[33.3%] p-7 font-bold  rounded-lg font-redhat text-3xl ${getColor(
              key as keyof SurveyData
            )}`}
          >
            <div>{key}</div>
            <div className="text-3xl">
              {((value / totalVotes) * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurveyThermometer;
