"use client";
import { useMemo } from "react";
import { Alumni, Event, EventRegistration, Member, Role, VisionaryLabProject } from "../utility/types";

type Args = {
  roles: Role[];
  membersState: Member[];
  eventsState: Event[];
  registrationsState: EventRegistration[];
  projectMemberRoles: { project_id: number; member_id: number }[];
  alumniState: Alumni[];
  projectsState: VisionaryLabProject[];
};

export default function useAdminDerived({
  roles,
  membersState,
  eventsState,
  registrationsState,
  projectMemberRoles,
  alumniState,
  projectsState,
}: Args) {
  const roleById = useMemo(() => new Map(roles.map(r => [r.role_id, r.role])), [roles]);
  const memberById = useMemo(() => new Map(membersState.map(m => [m.member_id, m])), [membersState]);

  const membersByRole = useMemo(() => {
    const map = new Map<string, number>();
    membersState.forEach(m => {
      const name = m.role_id ? (roleById.get(m.role_id) ?? "Unassigned") : "Unassigned";
      map.set(name, (map.get(name) ?? 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [membersState, roleById]);

  const registrationsByEvent = useMemo(() => {
    const map = new Map<number, { registered: number; present: number }>();
    registrationsState.forEach(r => {
      const rec = map.get(r.event_id) ?? { registered: 0, present: 0 };
      if (r.registered) rec.registered += 1;
      // NOTE: your code used attendance === 1 as "present".
      // If attendance is string union ("present" | "absent" | "late" | null) adjust here:
      if ((r as any).attendance === 1 || (r as any).attendance === "present") rec.present += 1;
      map.set(r.event_id, rec);
    });
    return map;
  }, [registrationsState]);

  const projectTeamCounts = useMemo(() => {
    const map = new Map<number, number>();
    projectMemberRoles.forEach(pm => {
      map.set(pm.project_id, (map.get(pm.project_id) ?? 0) + 1);
    });
    return map;
  }, [projectMemberRoles]);

  const activeProjects = useMemo(() => projectsState.filter(p => p.status === "active"), [projectsState]);

  const upcomingEvents = useMemo(() => {
    return eventsState
      .filter(e => !!e.event_date)
      .slice()
      .sort((a, b) => new Date(a.event_date as string).getTime() - new Date(b.event_date as string).getTime())
      .filter(e => new Date(e.event_date as string).getTime() >= Date.now())
      .slice(0, 5);
  }, [eventsState]);

  const kpiTotalMembers = membersState.length;
  const kpiActiveProjects = activeProjects.length;
  const kpiEventsThisMonth = useMemo(() => {
    const now = new Date();
    return eventsState.filter(e => {
      if (!e.event_date) return false;
      const d = new Date(e.event_date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }).length;
  }, [eventsState]);
  const kpiAlumni = alumniState.length;

  return {
    roleById,
    memberById,
    membersByRole,
    registrationsByEvent,
    projectTeamCounts,
    kpiTotalMembers,
    kpiActiveProjects,
    kpiEventsThisMonth,
    kpiAlumni,
    upcomingEvents,
  };
}
