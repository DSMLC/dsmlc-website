import HomeData from "../public/data/page_data/home.json";
import Hero from "./components/Hero";
import PageTemplate from "./components/templates/HeaderTextTemplate";

export default async function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <PageTemplate Data={HomeData} />
    </div>
  );
}
