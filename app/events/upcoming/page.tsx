import DataLoader, { PageData } from "../../DataLoader";
import rawData from "../../../public/data/page_data/upcoming.json";
import { getUpcomingEventsByCategory } from "../../queries/events";
import type { UpcomingEventCard } from "../../queries/events";
export const dynamic = "force-dynamic";

const UpcomingEventsData: PageData[] = rawData as PageData[];

const introSection = UpcomingEventsData[0];

function buildEventSection(
  header: string,
  text: string,
  events: UpcomingEventCard[],
): PageData {
  return {
    type: "BackgroundFillTemplate",
    data: [
      {
        type: "HeaderTextTemplate2",
        data: [{ header, text }],
      },
      events.length > 0
        ? { type: "CardTemplate", data: events }
        : {
            type: "ComingSoonTemplate",
            data: {
              header: "Check Back for Future Events!",
              subtext: "Follow our Socials to stay Updated!",
              condition: {
                type: "array",
                data: { json: "", keys: [] },
              },
            },
          },
    ],
  };
}

export default async function Page() {
  const { finalComp, workshops, otherEvents } =
    await getUpcomingEventsByCategory();

  return (
    <div>
      <DataLoader pageData={introSection} />

      <DataLoader
        pageData={buildEventSection(
          "DSMLC's Annual Final Competition",
          "The DSMLC Annual Final Competition is your chance to showcase your data science and machine learning expertise, compete for top prizes, and make a lasting impact in the industry.",
          finalComp,
        )}
      />

      <DataLoader
        pageData={buildEventSection(
          "Workshops",
          "Come join us for upcoming workshop sessions that DSMLC hosts for its members.",
          workshops,
        )}
      />

      <DataLoader
        pageData={buildEventSection(
          "Other Events",
          "From Networking Nights that connect students with professionals to Movie Nights for casual fun and relaxation, we ensure a balance of professional growth and community engagement.",
          otherEvents,
        )}
      />
    </div>
  );
}
