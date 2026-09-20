import rawData from "../public/data/page_data/home.json";
import DataLoader, { PageData } from "./DataLoader";
import { getUpcomingEventsCombined, UpcomingEventCard } from "./queries/events";

const HomeData: PageData[] = rawData as PageData[];

export const dynamic = "force-dynamic";

function isUpcomingEventsSection(section: PageData): boolean {
  if (
    section.type !== "BackgroundFillTemplate" ||
    !Array.isArray(section.data)
  ) {
    return false;
  }
  return section.data.some(
    (nested: any) =>
      nested?.type === "HeaderTextTemplate2" &&
      Array.isArray(nested.data) &&
      nested.data.some((d: any) => d?.header === "Upcoming Events"),
  );
}

function buildUpcomingEventsSection(events: UpcomingEventCard[]): PageData {
  return {
    type: "BackgroundFillTemplate",
    data: [
      {
        type: "HeaderTextTemplate2",
        data: [
          {
            header: "Upcoming Events",
            text: "Join us for our next event! This is a great opportunity to connect with others and enhance your knowledge and skills.",
          },
        ],
      },
      events.length > 0
        ? { type: "CardTemplate", data: events }
        : {
            type: "ComingSoonTemplate",
            data: {
              header: "Check Back for Future Events!",
              subtext: "Follow our Socials to stay Updated!",
              condition: { type: "array", data: { json: "", keys: [] } },
            },
          },
      {
        type: "ButtonTemplate",
        data: [{ link: "/events/upcoming", name: "More Events" }],
      },
    ],
  };
}

export default async function Home() {
  const upcomingEvents = await getUpcomingEventsCombined(2);
  const upcomingEventsSection = buildUpcomingEventsSection(upcomingEvents);

  return (
    <div>
      {HomeData.map((section, index) => (
        <DataLoader
          key={index}
          pageData={
            isUpcomingEventsSection(section) ? upcomingEventsSection : section
          }
        />
      ))}
    </div>
  );
}
