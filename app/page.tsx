import rawData from "../public/data/page_data/home.json";
import DataLoader, { PageData } from "./DataLoader";
import CarouselTemplate from "./components/templates/CarouselTemplate";

const HomeData: PageData[] = rawData as PageData[];

const images = [
  { src: "/images/events/fall_2024/int_and_app.png", alt: "Description 1" },
  { src: "/images/events/fall_2024/int_and_app2.png", alt: "Description 2" },
  {
    src: "/images/events/fall_2024/meet_and_greet.png",
    alt: "Description 3",
  },
];

export default async function Home() {
  return (
    <div>
      {HomeData.map((section, index) => (
        <DataLoader key={index} pageData={section} />
      ))}
    </div>
  );
}
