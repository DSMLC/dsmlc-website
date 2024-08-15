import Image from "next/image";
import HomeData from "../public/data/home.json";
import Hero from "./components/Hero";
import PageTemplate from "./components/HeaderTextTemplate";

export default async function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <PageTemplate Data={HomeData} />
    </div>
  );
}
