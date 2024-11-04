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
      <span className="text-red-500 text-center text-3xl">
        THIS PAGE WILL BE A PLACE TO TEST TEMPLATES FOR NOW: all the content is just placeholder{" "}
      </span>
      {HomeData.map((section, index) => (
        <DataLoader key={index} pageData={section} />
      ))}
      <CarouselTemplate
        images={images}
        interval={5000} // Optional: defaults to 5000ms (5 seconds)
        type="Pic" // Optional: defaults to "Pic"
      />
    </div>
  );
}
