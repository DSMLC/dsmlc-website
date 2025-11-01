"use client";
import React, { useEffect, useState } from "react";
import { Brain, Check, Trophy, PartyPopper } from "lucide-react";

// AI buzzwords for the bingo board
const aiTerms = [
  // Tech & Data-Oriented
  "Has built or deployed a machine learning model",
  "Works with data pipelines or ETL tools",
  "Can explain what an API is",
  "Knows what overfitting means",
  "Uses Python daily",
  "Knows what SQL stands for",
  "Has tried using AI to automate a task",
  "Is interested in generative AI",
  "Has broken production code before",
  "Has used cloud platforms (AWS, Azure, or GCP)",
  "Can explain what “big data” really means",
  "Has taken a statistics course they actually liked",
  "Has written a technical report for a project",
  "Has done a Kaggle competition",
  "Is researching AI or data science in academia",

  // Business, Management & Strategy
  "Has pitched an idea or project to leadership or clients",
  "Knows what EBITDA stands for",
  "Can explain what synergy is",
  "Has worked with or helped grow a startup",
  "Can explain SWOT analysis",
  "Can explain what a stakeholder analysis is",
  "Can define what “return on investment” means",

  // Engineering & Innovation
  "Has built a prototype or project from scratch",
  "Can explain what an API endpoint is",
  "Works with or studies engineering",
  "Has used sensors or robotics in a project",
  "Has participated in a hackathon",
  "Has taken apart a device just to see how it works",
  "Knows what version control is",
  "Works in system design or architecture",
  "Loves solving optimization problems",

  // Personal & Fun Prompts
  "Has traveled to more than 3 countries",
  "Has read a book related to tech or business recently",
  "Plays an instrument or creates art",
  "Has met someone famous",
  "Shares the same birthday month as you",
  "Has taken a risk that paid off",
  "Has a side hustle or creative project",
  "Can recommend a good podcast",
  "Has failed at something but learned a lot from it",
  "Has switched fields or industries at least once",
  "Checks Linkedin first thing in the morning",
  "Can tell you their MBTI",
  "Knows at least three useless fun facts",
  "Can show you their most recent photo in their camera roll",
  "Is double majoring in something",
];

function shuffleArray(array: string[]) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function checkBingo(marks: boolean[]): boolean {
  // Check rows
  for (let i = 0; i < 5; i++) {
    if (marks.slice(i * 5, (i + 1) * 5).every(Boolean)) return true;
  }
  // Check columns
  for (let i = 0; i < 5; i++) {
    if ([0, 1, 2, 3, 4].every((j) => marks[i + j * 5])) return true;
  }
  // Check diagonals
  if ([0, 6, 12, 18, 24].every((i) => marks[i])) return true;
  if ([4, 8, 12, 16, 20].every((i) => marks[i])) return true;
  return false;
}
const Page = () => {
  const [board, setBoard] = useState<string[]>([]);
  const [marks, setMarks] = useState<boolean[]>(new Array(25).fill(false));
  const [hasBingo, setHasBingo] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Generate a new random board on initial load
    setBoard(shuffleArray(aiTerms).slice(0, 25));
  }, []);

  useEffect(() => {
    if (checkBingo(marks)) {
      setHasBingo(true);
    }
    // Check if all squares are marked
    if (marks.every(Boolean)) {
      setIsComplete(true);
    }
  }, [marks]);

  const handleSquareClick = (index: number) => {
    const newMarks = [...marks];
    newMarks[index] = !newMarks[index];
    setMarks(newMarks);
    setSelectedTerm(index);
  };

  const handleNewGame = () => {
    setBoard(shuffleArray(aiTerms).slice(0, 25));
    setMarks(new Array(25).fill(false));
    setHasBingo(false);
    setIsComplete(false);
    setSelectedTerm(null);
  };

  return (
    <div className="min-h-screen bg-transparent flex justify-center items-start px-3 sm:px-6 py-6">
      <div className="w-full max-w-4xl bg-zinc-900 border border-orange-400/50 rounded-2xl shadow-lg p-4 sm:p-6">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" />
            <h1 className="text-2xl sm:text-4xl font-bold text-orange-400">
              Networking Night Buzzword Bingo
            </h1>
          </div>
          <p className="text-sm sm:text-base text-orange-200/80 max-w-2xl mx-auto px-2">
            Network with others and find anyone who can answer each box before
            marking it off. First to get 5 in a row (horizontal, vertical, or
            diagonal) wins! Keep going to fill the whole board!
          </p>
          <button
            onClick={handleNewGame}
            className="mt-3 sm:mt-4 px-4 py-2 bg-orange-400 text-zinc-900 font-bold rounded-lg hover:bg-orange-300 transition-colors text-sm sm:text-base"
          >
            Start New Game
          </button>
        </div>

        {hasBingo && !isComplete && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-zinc-800/50 rounded-lg text-center border border-orange-400/50">
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
              <p className="text-sm sm:text-base text-orange-300 font-semibold">
                BINGO! Keep going to complete the board!
              </p>
            </div>
          </div>
        )}

        {isComplete && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-zinc-800/50 rounded-lg text-center border border-orange-400/50">
            <div className="flex items-center justify-center gap-2">
              <PartyPopper className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
              <p className="text-sm sm:text-base text-orange-300 font-semibold">
                Congratulations! You&apos;ve completed the entire board!
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-5 gap-1 sm:gap-2 mb-4 sm:mb-6">
          {board.map((term, index) => (
            <button
              key={index}
              onClick={() => handleSquareClick(index)}
              className={`
                aspect-square p-1 sm:p-2 rounded-lg text-[10px] leading-tight sm:text-sm font-medium transition-all
                ${
                  marks[index]
                    ? "bg-orange-400 text-zinc-900 shadow-lg transform scale-[0.98]"
                    : "bg-zinc-800 text-orange-300 border border-orange-400/20 shadow-md hover:shadow-lg hover:scale-[1.02] hover:border-orange-400/40"
                }
                ${selectedTerm === index ? "ring-2 ring-orange-300" : ""}
              `}
            >
              <div className="h-full flex flex-col items-center justify-center text-center">
                {term}
                {marks[index] && (
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 mt-1" />
                )}
              </div>
            </button>
          ))}
        </div>

        {selectedTerm !== null && (
          <div className="bg-zinc-800 border border-orange-400/20 p-3 sm:p-4 rounded-lg shadow-md">
            <h2 className="font-semibold text-orange-400 mb-1 sm:mb-2 text-sm sm:text-base">
              Selected Term: {board[selectedTerm]}
            </h2>
            <p className="text-orange-200/80 text-sm sm:text-base">
              Find someone who can explain this term to you before marking it
              off!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
