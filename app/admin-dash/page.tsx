"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataLoader, { PageData } from "../DataLoader";
import supabase from "../supabase_client";
import { useAdminAuth } from "../contexts/AdminAuthContext";

const TABLES = {
  roles: "Role",
  members: "Member",
  events: "Evt",
  registrations: "EventRegistration",
  projects: "VisionaryLabProject",
  projectMemberRoles: "VisionaryLabMemberRole",
  alumni: "Alumni",
} as const;

export default function AdminDashPage() {
  const [sections, setSections] = useState<PageData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading, signOut } = useAdminAuth();
  const router = useRouter();

  // redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/admin-dash/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    // only get data if user is authenticated
    if (!user) return;

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
  }, [user]);

  // loading screen while checking auth
  if (authLoading) {
    return (
      <div className="w-full text-center font-redHat font-bold text-xl dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
        Authenticating...
      </div>
    );
  }

  // dont render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  if (!sections) {
    return (
      <div className="w-full text-center font-redHat font-bold text-xl dark:text-dark-dsmlcBlack text-light-dsmlcBlack">
        Loading admin dashboard…
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/admin-dash/login");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
      {/* Admin Header */}
      <div
        className="
      relative overflow-hidden
      flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between
      bg-light-dsmlcWhite dark:bg-dark-dsmlcWhite
      border border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment
      shadow-lg shadow-light-dsmlcParchment dark:shadow-dark-dsmlcParchment
      rounded-3xl p-6 sm:p-7
    "
      >
        {/* Left: Title + meta */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold font-redHat tracking-tight text-dsmlcTangerine">
            Admin Dashboard
          </h1>

          <div className="flex items-center gap-2">
            <p className="text-sm text-light-dsmlcBlack/70 dark:text-dark-dsmlcBlack/70">
              Welcome,
            </p>
            <div className="flex items-center gap-2 rounded-full border border-light-dsmlcEnhancedParchment dark:border-dark-dsmlcEnhancedParchment px-3 py-1.5">
              <div className="flex h-7 w-25 items-center justify-center rounded-full bg-dsmlcTangerine/10 text-dsmlcTangerine font-semibold">
                {user.email?.[0]?.toUpperCase() ?? "U"}
              </div>
              <span className="text-sm font-medium text-light-dsmlcBlack dark:text-dark-dsmlcBlack">
                {user.email}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSignOut}
            className="
      inline-flex items-center justify-center
      rounded-full border border-dsmlcTangerine
      bg-transparent px-5 py-2 text-sm font-medium
      text-dsmlcTangerine
      hover:bg-dsmlcTangerine hover:text-white
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dsmlcTangerine/60
      shadow-sm hover:shadow-md
      transition-all duration-200
    "
          >
            Sign Out
          </button>
        </div>

        {/* corner accent */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-dsmlcTangerine/10 blur-2xl" />
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error rounded-xl">
          <span className="font-medium">Error:</span> {error}
        </div>
      )}

      {/* Content Sections */}
      <div className="w-full space-y-6">
        {sections.map((section, idx) => (
          <DataLoader key={idx} pageData={section} />
        ))}
      </div>
    </div>
  );
}
