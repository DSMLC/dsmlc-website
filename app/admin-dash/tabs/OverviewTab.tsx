"use client";
import React from "react";
import Kpi from "../components/Kpi";
import { fmtDate, SECTION_CARD } from "../components/ui";
import { Event } from "../utility/types";

type Props = {
  kpiTotalMembers: number;
  kpiActiveProjects: number;
  kpiEventsThisMonth: number;
  kpiAlumni: number;
  membersByRole: [string, number][];
  upcomingEvents: Event[];
  registrationsByEvent: Map<number, { registered: number; present: number }>;
};

export default function OverviewTab({
  kpiTotalMembers,
  kpiActiveProjects,
  kpiEventsThisMonth,
  kpiAlumni,
  membersByRole,
  upcomingEvents,
  registrationsByEvent,
}: Props) {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Kpi label="Members" value={kpiTotalMembers} />
        <Kpi label="Active V.L Projects" value={kpiActiveProjects} />
        <Kpi label="Events (this month)" value={kpiEventsThisMonth} />
        <Kpi label="Alumni" value={kpiAlumni} />
      </div>

      <div className={SECTION_CARD}>
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-dsmlcTangerine">
          Members by Role
        </h2>
        <div className="overflow-x-auto">
          <table className="table-fixed w-full">
            <thead>
              <tr>
                <th className="text-xs md:text-sm sticky dark:text-dark-dsmlcBlack text-light-dsmlcBlack bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite">
                  Role
                </th>
                <th className="text-xs md:text-sm sticky dark:text-dark-dsmlcBlack text-light-dsmlcBlack bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite">
                  Count
                </th>
              </tr>
            </thead>
            <tbody>
              {membersByRole.map(([role, count]) => (
                <tr key={role} className="hover">
                  <td className="border-r dark:text-dark-dsmlcBlack text-light-dsmlcBlack border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment">
                    <span>{role}</span>
                  </td>
                  <td className="text-center dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
                    {count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={SECTION_CARD}>
        <h2 className="text-lg font-semibold mb-4 text-dsmlcTangerine">
          Upcoming Events
        </h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="sticky dark:text-dark-dsmlcBlack text-light-dsmlcBlack bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite">
                  Name
                </th>
                <th className="sticky dark:text-dark-dsmlcBlack text-light-dsmlcBlack bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite">
                  Date
                </th>
                <th className="sticky dark:text-dark-dsmlcBlack text-light-dsmlcBlack bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite">
                  Type
                </th>
                <th className="text-center sticky dark:text-dark-dsmlcBlack text-light-dsmlcBlack bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite">
                  Registered
                </th>
                <th className="text-center sticky dark:text-dark-dsmlcBlack text-light-dsmlcBlack bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite">
                  Present
                </th>
              </tr>
            </thead>
            <tbody>
              {upcomingEvents.map((e) => {
                const agg = registrationsByEvent.get(e.event_id) ?? {
                  registered: 0,
                  present: 0,
                };
                return (
                  <tr key={e.event_id} className="hover">
                    <td className="text-center border-r dark:text-dark-dsmlcBlack text-light-dsmlcBlack border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment">
                      {e.event_name}
                    </td>
                    <td className="text-center whitespace-nowrap dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
                      {fmtDate(e.event_date)}
                    </td>
                    <td className="text-center dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
                      {e.event_type ?? "—"}
                    </td>
                    <td className="text-center dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
                      {agg.registered}
                    </td>
                    <td className="text-center dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
                      {agg.present}
                    </td>
                  </tr>
                );
              })}
              {upcomingEvents.length === 0 && (
                <tr>
                  <td
                    className="text-center dark:text-dark-dsmlcBlack text-light-dsmlcBlack pt-8"
                    colSpan={5}
                  >
                    No upcoming events.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
