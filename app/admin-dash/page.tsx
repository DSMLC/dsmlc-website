"use client";

import React, { useEffect, useState } from "react";
import DataLoader, { PageData } from "../DataLoader";
import supabase from "../supabase_client";

const TABLES = {
  roles: "Role",
  members: "Member",
  events: "Event",
  registrations: "EventRegistration",
  projects: "VisionaryLabProject",
  projectMemberRoles: "VisionaryLabMemberRole",
  alumni: "Alumni",
} as const;

export default function AdminDashPage() {
  const [sections, setSections] = useState<PageData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Fetch all tables in parallel
        const [
          rolesRes,
          membersRes,
          eventsRes,
          regsRes,
          projectsRes,
          projMemberRolesRes,
          alumniRes,
        ] = await Promise.all([
          supabase.schema("admin").from(TABLES.roles).select("*"),
          supabase.schema("admin").from(TABLES.members).select("*"),
          supabase.schema("admin").from(TABLES.events).select("*"),
          supabase.schema("admin").from(TABLES.registrations).select("*"),
          supabase.schema("admin").from(TABLES.projects).select("*"),
          supabase.schema("admin").from(TABLES.projectMemberRoles).select("*"),
          supabase.schema("admin").from(TABLES.alumni).select("*"),
        ]);

        const errs = [
          rolesRes.error,
          membersRes.error,
          eventsRes.error,
          regsRes.error,
          projectsRes.error,
          projMemberRolesRes.error,
          alumniRes.error,
        ].filter(Boolean);

        if (errs.length) {
          throw new Error(errs.map((e) => e!.message).join(" | "));
        }

        const dashboardData = {
          roles: rolesRes.data ?? [],
          members: membersRes.data ?? [],
          events: eventsRes.data ?? [],
          registrations: regsRes.data ?? [],
          projects: projectsRes.data ?? [],
          projectMemberRoles: projMemberRolesRes.data ?? [],
          alumni: alumniRes.data ?? [],
        };

        const builtSections: PageData[] = [
          {
            type: "BackgroundFillTemplate3",
            data: [
              {
                type: "TitleTemplate1",
                data: {
                  title: "Admin Dashboard",
                },
              },
              {
                type: "AdminDataDashboardTemplate",
                data: dashboardData,
              },
            ],
          },
        ];

        setSections(builtSections);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load dashboard");
        // Still render page frame so you can see the error and recover
        setSections([
          {
            type: "TitleTemplate1",
            data: { title: "Admin Dashboard", subtitle: "Error loading data" },
          },
        ]);
      }
    })();
  }, []);

  if (!sections) {
    return (
      <div className="w-full text-center font-redHat font-bold text-xl dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
        Loading admin dashboard…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-8">
      {error && <div className="alert alert-error">{error}</div>}
      {sections.map((section, idx) => (
        <DataLoader key={idx} pageData={section} />
      ))}
    </div>
  );
}
