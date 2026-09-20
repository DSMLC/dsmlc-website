interface UpcomingEventRow {
  event_id: string;
  event_name: string;
  event_date: string;
  event_type: string;
  location: string | null;
  registration_link: string | null;
}

export interface UpcomingEventCard {
  title: string;
  location?: string;
  startDate: string;
  button: {
    link: string;
    name: string;
  };
}

function toCard(row: UpcomingEventRow): UpcomingEventCard {
  return {
    title: row.event_name,
    location: row.location ?? undefined,
    startDate: row.event_date,
    button: {
      link: row.registration_link || "#",
      name: row.registration_link
        ? "Register for Event"
        : "Event Ended",
    },
  };
}

async function fetchUpcomingEventRows(): Promise<UpcomingEventRow[]> {
  const today = new Date().toISOString().slice(0, 10);

  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(
    /\/$/,
    ""
  );
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "";

  const params = new URLSearchParams({
    select:
      "event_id,event_name,event_date,event_type,location,registration_link",
    event_date: `gte.${today}`,
    order: "event_date.asc",
  });

  const url = `${supabaseUrl}/rest/v1/EVENTS?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Accept-Profile": "adminportal",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Error fetching upcoming events:", res.status, body);
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error("Error fetching upcoming events:", err);
    return [];
  }
}

export async function getUpcomingEventsByCategory(): Promise<{
  finalComp: UpcomingEventCard[];
  workshops: UpcomingEventCard[];
  otherEvents: UpcomingEventCard[];
}> {
  const data = await fetchUpcomingEventRows();

  const finalComp = data
    .filter((e) => e.event_type === "Competition")
    .map(toCard);
  const workshops = data
    .filter((e) => e.event_type === "Workshop")
    .map(toCard);
  const otherEvents = data
    .filter((e) => e.event_type === "Social")
    .map(toCard);

  return { finalComp, workshops, otherEvents };
}

export async function getUpcomingEventsCombined(
  limit: number
): Promise<UpcomingEventCard[]> {
  const data = await fetchUpcomingEventRows();
  return data.slice(0, limit).map(toCard);
}