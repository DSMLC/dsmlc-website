"use client";
import React, { useMemo, useState, useEffect } from "react";
import {
  AdminDataDashboardTemplateProps,
  Alumni,
  Event,
  Member,
  VisionaryLabProject,
  EventRegistration,
  VisionaryLabMemberRole,
  Guest,
} from "./utility/types";
import {
  deleteRow,
  deleteWhere,
  upsertRow,
  insertRow,
} from "./utility/adminCrud";

import OverviewTab from "./tabs/OverviewTab";
import MembersTab from "./tabs/MembersTab";
import ProjectsTab from "./tabs/ProjectsTab";
import EventsTab from "./tabs/EventsTab";
import AlumniTab from "./tabs/AlumniTab";
import useAdminDerived from "./utility/adminDerived";

import SidebarTabs, { Tab } from "./components/SidebarTabs";
import MemberEditorModal from "./modals/MemberEditorModal";
import ProjectEditorModal from "./modals/ProjectEditorModal";
import EventEditorModal from "./modals/EventEditorModal";
import AlumniEditorModal from "./modals/AlumniEditorModal";
import EventRegistrationModal from "./modals/EventRegistrationModal";
import ProjectMembersModal from "./modals/ProjectMemberModal";

type RegRow = EventRegistration & { member?: Member; guest?: Guest };

const AdminDataDashboardTemplate: React.FC<AdminDataDashboardTemplateProps> = ({
  Data,
}) => {
  const {
    roles,
    members,
    events,
    registrations,
    projects,
    projectMemberRoles,
    alumni,
    guests,
  } = Data;

  // =========================== Tab + local DB mirrors ===========================
  const [tab, setTab] = useState<Tab>("Overview");
  const [membersState, setMembersState] = useState<Member[]>(members);
  const [projectsState, setProjectsState] =
    useState<VisionaryLabProject[]>(projects);
  const [eventsState, setEventsState] = useState<Event[]>(events);
  const [alumniState, setAlumniState] = useState<Alumni[]>(alumni);
  const [registrationsState, setRegistrationsState] =
    useState<EventRegistration[]>(registrations);
  const [projMembersState, setProjMembersState] =
    useState<VisionaryLabMemberRole[]>(projectMemberRoles);
  const [guestsState, setGuestsState] = useState<Guest[]>(guests ?? []);

  useEffect(() => {
    setMembersState(members);
    setProjectsState(projects);
    setEventsState(events);
    setAlumniState(alumni);
    setRegistrationsState(registrations);
    setProjMembersState(projectMemberRoles);
    setGuestsState(guests ?? []);
  }, [
    members,
    projects,
    events,
    alumni,
    registrations,
    projectMemberRoles,
    guests,
  ]);

  // =========================== Selections ===========================
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedAlumniMemberId, setSelectedAlumniMemberId] = useState<
    number | null
  >(null);
  const guestById = useMemo(
    () => new Map(guestsState.map((g) => [g.guest_id, g])),
    [guestsState]
  );

  const selectedMember = useMemo(
    () => membersState.find((m) => m.member_id === selectedMemberId) ?? null,
    [membersState, selectedMemberId]
  );
  const selectedProject = useMemo(
    () => projectsState.find((p) => p.project_id === selectedProjectId) ?? null,
    [projectsState, selectedProjectId]
  );
  const selectedEvent = useMemo(
    () => eventsState.find((e) => e.event_id === selectedEventId) ?? null,
    [eventsState, selectedEventId]
  );
  const selectedAlumni = useMemo(
    () =>
      alumniState.find((a) => a.member_id === selectedAlumniMemberId) ?? null,
    [alumniState, selectedAlumniMemberId]
  );

  // =========================== Modal States ===========================
  const [memberModal, setMemberModal] = useState<{
    mode: "create" | "edit";
    initial: Partial<Member>;
  } | null>(null);
  const [projectModal, setProjectModal] = useState<{
    mode: "create" | "edit";
    initial: Partial<VisionaryLabProject>;
  } | null>(null);
  const [eventModal, setEventModal] = useState<{
    mode: "create" | "edit";
    initial: Partial<Event>;
  } | null>(null);
  const [alumniModal, setAlumniModal] = useState<{
    mode: "create" | "edit";
    initial: Partial<Alumni>;
  } | null>(null);

  const [regsModal, setRegsModal] = useState<{ event: Event } | null>(null);
  const [projMembersModal, setProjMembersModal] = useState<{
    project: VisionaryLabProject;
  } | null>(null);

  // =========================== Derived joins & KPIs  ===========================
  const {
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
  } = useAdminDerived({
    roles,
    membersState,
    eventsState,
    registrationsState,
    projectMemberRoles: projMembersState,
    alumniState,
    projectsState,
  });

  // =========================== Modal data rows ===========================
  const modalRegistrationRows = useMemo<RegRow[]>(() => {
    if (!regsModal?.event?.event_id) return [];
    const id = regsModal.event.event_id;
    return registrationsState
      .filter((r) => r.event_id === id)
      .map((r) => ({
        ...r,
        member: r.member_id != null ? memberById.get(r.member_id) : undefined,
        guest: r.guest_id != null ? guestById.get(r.guest_id) : undefined,
      }));
  }, [regsModal, registrationsState, memberById, guestById]);

  const modalProjectMemberRows = useMemo(() => {
    if (!projMembersModal?.project?.project_id) return [];
    const pid = projMembersModal.project.project_id;
    return projMembersState
      .filter((pm) => pm.project_id === pid)
      .map((pm) => ({
        project_id: pm.project_id,
        member_id: pm.member_id,
        project_role: pm.project_role ?? null,
        member: memberById.get(pm.member_id),
      }));
  }, [projMembersModal, projMembersState, memberById]);

  // =========================== DB REST Actions ===========================
  const onDeleteMember = async (m: Member) => {
    if (
      !confirm(`Delete ${m.first_name} ${m.last_name}? This cannot be undone.`)
    )
      return;
    const snapshot = membersState;
    setMembersState((prev) => prev.filter((x) => x.member_id !== m.member_id));
    try {
      await deleteRow("Member", "member_id", m.member_id);
      if (selectedMemberId === m.member_id) setSelectedMemberId(null);
    } catch (e: any) {
      setMembersState(snapshot);
      alert(`Delete failed: ${e?.message ?? e}`);
    }
  };

  const onDeleteProject = async (p: VisionaryLabProject) => {
    if (!confirm(`Delete project "${p.name}"? This cannot be undone.`)) return;
    const snapshot = projectsState;
    setProjectsState((prev) =>
      prev.filter((x) => x.project_id !== p.project_id)
    );
    try {
      await deleteRow("VisionaryLabProject", "project_id", p.project_id);
      if (selectedProjectId === p.project_id) setSelectedProjectId(null);
    } catch (e: any) {
      setProjectsState(snapshot);
      alert(`Delete failed: ${e?.message ?? e}`);
    }
  };

  const onDeleteEvent = async (ev: Event) => {
    if (!confirm(`Delete event "${ev.event_name}"? This cannot be undone.`))
      return;
    const snapshot = eventsState;
    setEventsState((prev) => prev.filter((x) => x.event_id !== ev.event_id));
    try {
      await deleteRow("Evt", "event_id", ev.event_id);
      if (selectedEventId === ev.event_id) setSelectedEventId(null);
    } catch (e: any) {
      setEventsState(snapshot);
      alert(`Delete failed: ${e?.message ?? e}`);
    }
  };

  const onDeleteAlumni = async (a: Alumni) => {
    if (
      !confirm(
        `Delete alumni row for member #${a.member_id}? This cannot be undone.`
      )
    )
      return;
    const snapshot = alumniState;
    setAlumniState((prev) => prev.filter((x) => x.member_id !== a.member_id));
    try {
      await deleteRow("Alumni", "member_id", a.member_id);
      if (selectedAlumniMemberId === a.member_id)
        setSelectedAlumniMemberId(null);
    } catch (e: any) {
      setAlumniState(snapshot);
      alert(`Delete failed: ${e?.message ?? e}`);
    }
  };

  const onDeleteRegistration = async ({
    event_id,
    member_id = null,
    guest_id = null,
  }: {
    event_id: number;
    member_id?: number | null;
    guest_id?: number | null;
  }) => {
    await deleteWhere("EventRegistration", { event_id, member_id, guest_id });

    setRegistrationsState((prev) =>
      prev.filter((r) => {
        if (r.event_id !== event_id) return true;
        // remove either by member_id or by guest_id
        if (member_id !== null && member_id !== undefined) {
          return r.member_id !== member_id;
        }
        if (guest_id !== null && guest_id !== undefined) {
          return (r as any).guest_id !== guest_id;
        }
        return true;
      })
    );
  };

  const upsertRegistration = async (row: EventRegistration) => {
    try {
      const payload = {
        event_id: row.event_id,
        member_id: row.member_id ?? null,
        guest_id: row.guest_id ?? null,
        registered: row.registered,
        attendance: row.attendance ?? null,
      };

      const conflict =
        row.member_id != null
          ? ["event_id", "member_id"]
          : ["event_id", "guest_id"];

      const data = await upsertRow<EventRegistration>(
        "EventRegistration",
        payload,
        conflict
      );

      setRegistrationsState((prev) => {
        const same = (a: EventRegistration, b: EventRegistration) =>
          a.event_id === b.event_id &&
          (a.member_id ?? null) === (b.member_id ?? null) &&
          (a.guest_id ?? null) === (b.guest_id ?? null);

        const withoutOld = prev.filter((r) => !same(r, data));
        return [data, ...withoutOld];
      });
    } catch (e: any) {
      alert(`Save failed: ${e?.message ?? e}`);
    }
  };

  // ---- Project member role upsert
  const upsertProjectMember = async (row: VisionaryLabMemberRole) => {
    try {
      const normalized = (row.project_role ?? "").trim();
      const data = await upsertRow<VisionaryLabMemberRole>(
        "VisionaryLabMemberRole",
        {
          project_id: row.project_id,
          member_id: row.member_id,
          project_role: normalized === "" ? null : normalized,
        } as any, // DB allows null; runtime payload normalized
        ["project_id", "member_id"]
      );
      setProjMembersState((prev) => {
        const idx = prev.findIndex(
          (x) =>
            x.project_id === data.project_id && x.member_id === data.member_id
        );
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], ...data };
          return copy;
        }
        return [data, ...prev];
      });
    } catch (e: any) {
      alert(`Save failed: ${e?.message ?? e}`);
    }
  };

  const deleteProjectMember = async ({
    project_id,
    member_id,
  }: {
    project_id: number;
    member_id: number;
  }) => {
    try {
      await deleteWhere("VisionaryLabMemberRole", { project_id, member_id });
      setProjMembersState((prev) =>
        prev.filter(
          (x) => !(x.project_id === project_id && x.member_id === member_id)
        )
      );
    } catch (e: any) {
      alert(`Delete failed: ${e?.message ?? e}`);
    }
  };

  const onCreateGuest = async (g: {
    first_name: string;
    last_name: string;
    email?: string | null;
  }) => {
    const saved = await insertRow<Guest>("Guest", {
      first_name: g.first_name,
      last_name: g.last_name,
      email: g.email ?? null,
    });
    setGuestsState((prev) => [saved, ...prev]);
    return saved;
  };

  // =========================== Render UI Sections ===========================
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-8">
        <SidebarTabs value={tab} onChange={setTab} />

        <div className="space-y-6">
          {tab === "Overview" && (
            <OverviewTab
              kpiTotalMembers={kpiTotalMembers}
              kpiActiveProjects={kpiActiveProjects}
              kpiEventsThisMonth={kpiEventsThisMonth}
              kpiAlumni={kpiAlumni}
              membersByRole={membersByRole}
              upcomingEvents={upcomingEvents}
              registrationsByEvent={registrationsByEvent}
            />
          )}

          {tab === "Members" && (
            <MembersTab
              members={membersState}
              roleById={roleById}
              selectedMemberId={selectedMemberId}
              setSelectedMemberId={setSelectedMemberId}
              setMemberModal={setMemberModal}
              onDeleteMember={onDeleteMember}
            />
          )}

          {tab === "Projects" && (
            <ProjectsTab
              projects={projectsState}
              memberById={memberById}
              projectTeamCounts={projectTeamCounts}
              selectedProjectId={selectedProjectId}
              setSelectedProjectId={setSelectedProjectId}
              setProjectModal={setProjectModal}
              setProjMembersModal={setProjMembersModal}
              onDeleteProject={onDeleteProject}
            />
          )}

          {tab === "Events" && (
            <EventsTab
              events={eventsState}
              registrationsByEvent={registrationsByEvent}
              selectedEventId={selectedEventId}
              setSelectedEventId={setSelectedEventId}
              setEventModal={setEventModal}
              setRegsModal={setRegsModal}
              onDeleteEvent={onDeleteEvent}
            />
          )}

          {tab === "Alumni" && (
            <AlumniTab
              alumni={alumniState}
              memberById={memberById}
              selectedAlumniMemberId={selectedAlumniMemberId}
              setSelectedAlumniMemberId={setSelectedAlumniMemberId}
              setAlumniModal={setAlumniModal}
              onDeleteAlumni={onDeleteAlumni}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      {memberModal && (
        <MemberEditorModal
          open={!!memberModal}
          mode={memberModal.mode}
          initial={memberModal.initial}
          onClose={() => setMemberModal(null)}
          onSaved={(row, mode) => {
            if (mode === "edit") {
              setMembersState((prev) =>
                prev.map((m) => (m.member_id === row.member_id ? row : m))
              );
            } else {
              setMembersState((prev) => [row, ...prev]);
              setSelectedMemberId(row.member_id);
            }
          }}
        />
      )}

      {projectModal && (
        <ProjectEditorModal
          open={!!projectModal}
          mode={projectModal.mode}
          initial={projectModal.initial}
          onClose={() => setProjectModal(null)}
          onSaved={(row, mode) => {
            if (mode === "edit") {
              setProjectsState((prev) =>
                prev.map((p) => (p.project_id === row.project_id ? row : p))
              );
            } else {
              setProjectsState((prev) => [row, ...prev]);
              setSelectedProjectId(row.project_id);
            }
          }}
        />
      )}

      {eventModal && (
        <EventEditorModal
          open={!!eventModal}
          mode={eventModal.mode}
          initial={eventModal.initial}
          onClose={() => setEventModal(null)}
          onSaved={(row, mode) => {
            if (mode === "edit") {
              setEventsState((prev) =>
                prev.map((e) => (e.event_id === row.event_id ? row : e))
              );
            } else {
              setEventsState((prev) => [row, ...prev]);
              setSelectedEventId(row.event_id);
            }
          }}
        />
      )}

      {alumniModal && (
        <AlumniEditorModal
          open={!!alumniModal}
          mode={alumniModal.mode}
          initial={alumniModal.initial}
          onClose={() => setAlumniModal(null)}
          onSaved={(row, mode) => {
            if (mode === "edit") {
              setAlumniState((prev) =>
                prev.map((a) => (a.member_id === row.member_id ? row : a))
              );
            } else {
              setAlumniState((prev) => [row, ...prev]);
              setSelectedAlumniMemberId(row.member_id);
            }
          }}
        />
      )}

      {regsModal && (
        <EventRegistrationModal
          open
          event={regsModal.event}
          rows={modalRegistrationRows}
          roleById={roleById}
          members={membersState}
          onCreateGuest={onCreateGuest}
          onSaved={upsertRegistration}
          onDelete={onDeleteRegistration}
          onClose={() => setRegsModal(null)}
        />
      )}

      {projMembersModal ? (
        <ProjectMembersModal
          open
          project={projMembersModal.project}
          rows={modalProjectMemberRows}
          roleById={roleById}
          members={membersState}
          onSaved={upsertProjectMember} // single path create/edit
          onDelete={({ project_id, member_id }) =>
            deleteProjectMember({ project_id, member_id })
          }
          onClose={() => setProjMembersModal(null)}
        />
      ) : null}
    </div>
  );
};

export default AdminDataDashboardTemplate;
