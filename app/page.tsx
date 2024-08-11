// import Image from "next/image";
import HomeData from "C:/Users/andin/OneDrive/Documents/AllRepos/dsmlc-website/public/data/home.json";
import Hero from "./components/Hero";

export default async function Home() {
  return (
    <div className="flex gap-9 flex-col">
      <Hero />
      {Object.values(HomeData).map((data) => {
        return (
          <div className="flex gap-2 flex-col">
            <div className="text-2xl">{data.header}</div> <div>{data.text}</div>
            <p className="text-2xl">Projects</p>
          </div>
        );
      })}
    </div>
  );
}
