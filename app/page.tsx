import rawData from "../public/data/page_data/home.json";
import DataLoader, { PageData } from "./DataLoader";

const HomeData: PageData[] = rawData as PageData[];

export default async function Home() {
  return (
    <div>
      <span className="text-red-500 text-center text-3xl">
        THIS PAGE WILL BE A PLACE TO TEST TEMPLATES FOR NOW: all the content is just placeholder{" "}
      </span>
      {HomeData.map((section, index) => (
        <DataLoader key={index} pageData={section} />
      ))}
    </div>
  );
}
