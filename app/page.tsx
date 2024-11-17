import rawData from "../public/data/page_data/home.json";
import DataLoader, { PageData } from "./DataLoader";

const HomeData: PageData[] = rawData as PageData[];

export default async function Home() {
  return (
    <div>
      {HomeData.map((section, index) => (
        <DataLoader key={index} pageData={section} />
      ))}
    </div>
  );
}
