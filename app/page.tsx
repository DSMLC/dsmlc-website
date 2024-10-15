import HomeData from "../public/data/page_data/home.json";
import Hero from "./components/Hero";
import PageTemplate from "./components/templates/HeaderTextTemplate";
import PageTemplate2 from "./components/templates/HeaderTextTemplate2";
import LogoData from "../public/data/logo.json";
import HeroTemplate from "./components/templates/HeroTemplate";

export default async function Home() {
  return (
    <div className="flex flex-col">
      <HeroTemplate Data={LogoData.main_logo} />
      <PageTemplate Data={HomeData.header_text_template1} />
      <PageTemplate2 Data={HomeData.header_text_template1} />
    </div>
  );
}
