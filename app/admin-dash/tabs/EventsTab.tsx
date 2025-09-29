"use client";
import React from "react";
import SimpleTable from "../components/SimpleTable";
import { SECTION_CARD, fmtDate } from "../components/ui";
import { Event } from "../utility/types";

type Props = {
  events: Event[];
  registrationsByEvent: Map<number, { registered: number; present: number }>;
  selectedEventId: number | null;
  setSelectedEventId: (id: number | null) => void;
  setEventModal: React.Dispatch<
    React.SetStateAction<{
      mode: "create" | "edit";
      initial: Partial<Event>;
    } | null>
  >;
  setRegsModal: React.Dispatch<React.SetStateAction<{ event: Event } | null>>;
  onDeleteEvent: (e: Event) => Promise<void>;
};

export default function EventsTab({
  events,
  registrationsByEvent,
  selectedEventId,
  setSelectedEventId,
  setEventModal,
  setRegsModal,
  onDeleteEvent,
}: Props) {
  const selectedEvent =
    events.find((e) => e.event_id === selectedEventId) ?? null;

  return (
    <div className={SECTION_CARD}>
      <div className="flex items-center justify-between mb-4 gap-3">
        <h2 className="text-lg font-semibold text-dsmlcTangerine">Events</h2>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center justify-center rounded-full border border-dsmlcTangerine bg-transparent px-5 py-2 text-sm font-medium text-dsmlcTangerine hover:bg-dsmlcTangerine hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60 shadow-sm hover:shadow-md transition-all duration-200"
            onClick={() =>
              setEventModal({
                mode: "create",
                initial: { event_name: "", event_date: "" },
              })
            }
          >
            Add
          </button>
          <button
            className="inline-flex items-center justify-center rounded-full border border-dsmlcTangerine bg-transparent px-5 py-2 text-sm font-medium text-dsmlcTangerine hover:bg-dsmlcTangerine hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60 shadow-sm hover:shadow-md transition-all duration-200"
            disabled={!selectedEvent}
            onClick={() =>
              selectedEvent &&
              setEventModal({ mode: "edit", initial: selectedEvent })
            }
          >
            Edit
          </button>
          <button
            className="inline-flex items-center justify-center rounded-full border border-dsmlcTangerine bg-transparent px-5 py-2 text-sm font-medium text-dsmlcTangerine hover:bg-dsmlcTangerine hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60 shadow-sm hover:shadow-md transition-all duration-200"
            disabled={!selectedEvent}
            onClick={() => selectedEvent && onDeleteEvent(selectedEvent)}
          >
            Delete
          </button>

          <button
            className="inline-flex items-center justify-center rounded-full border border-dsmlcTangerine bg-transparent px-5 py-2 text-sm font-medium text-dsmlcTangerine hover:bg-dsmlcTangerine hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60 shadow-sm hover:shadow-md transition-all duration-200"
            disabled={!selectedEvent}
            onClick={() =>
              selectedEvent && setRegsModal({ event: selectedEvent })
            }
          >
            View registrations
          </button>
        </div>
      </div>

      <SimpleTable<Event>
        data={events}
        rowKey={(e) => e.event_id}
        searchPlaceholder="Search events…"
        stickyHeader
        zebra
        verticalDividers
        columnGroups={[
          { label: "Select", span: 1 },
          { label: "Event", span: 2 },
          { label: "Schedule", span: 1 },
          { label: "Attendance", span: 2 },
        ]}
        columns={[
          {
            key: "select",
            header: "",
            className:
              "w-[60px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
            render: (e) => (
              <div className="flex justify-center">
                <input
                  type="radio"
                  name="event-select"
                  className="radio"
                  checked={selectedEventId === e.event_id}
                  onChange={() => setSelectedEventId(e.event_id)}
                  aria-label={`Select event ${e.event_name}`}
                />
              </div>
            ),
          },
          {
            key: "event_name",
            header: "Name",
            className:
              "min-w-[200px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
          },
          {
            key: "event_type",
            header: "Type",
            className:
              "min-w-[120px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
          },
          {
            key: "event_date",
            header: "Date",
            className:
              "w-[120px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
            render: (e) => fmtDate(e.event_date),
          },
          {
            key: "registered",
            header: "Registered",
            className:
              "w-[120px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
            render: (e) =>
              registrationsByEvent.get(e.event_id)?.registered ?? 0,
          },
          {
            key: "present",
            header: "Present",
            className:
              "w-[120px] dark:text-dark-dsmlcBlack text-light-dsmlcBlack",
            render: (e) => registrationsByEvent.get(e.event_id)?.present ?? 0,
          },
        ]}
      />
    </div>
  );
}
