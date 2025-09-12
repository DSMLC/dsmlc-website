export type Role = { role_id: number; role: string };

export type Member = {
  member_id: number;
  first_name: string;
  last_name: string;
  email?: string | null;
  ucid?: string | null;
  major?: string | null;
  role_id?: number | null;
  year?: number | null;
  graduated?: boolean | null; // true if graduated
  join_date?: string | null;
};

export type Event = {
  event_id: number;                 // int, NOT NULL
  event_name: string;               // varchar, NOT NULL
  event_description: string | null; // text, NULLABLE
  event_type: string;               // varchar, NOT NULL
  event_date: string | null;        // date (YYYY-MM-DD), NULLABLE
};

export type EventRegistration = {
  event_id: number;
  member_id: number;
  registered: number;
  attendance?: number | null;
};

export type VisionaryLabProject = {
  project_id: number;
  name: string;
  project_type?: string;
  description?: string;
  start_date?: string; // ISO date
  end_date?: string | null; // ISO date or null
  status?: "planned" | "active" | "paused" | "completed" | string;
  project_lead?: number | null; // member_id (FK)
};

export type VisionaryLabMemberRole = {
  project_id: number;
  member_id: number;
  project_role: string; // e.g., "Developer", "PM"
};

export type Alumni = {
  member_id: number; // FK to Member
  graduation_year?: number | null;
  linkedin?: string | null;
  company?: string | null;
  position?: string | null;
};

export type AdminDataDashboardData = {
  roles: Role[];
  members: Member[];
  events: Event[];
  registrations: EventRegistration[];
  projects: VisionaryLabProject[];
  projectMemberRoles: VisionaryLabMemberRole[];
  alumni: Alumni[];
};

export interface AdminDataDashboardTemplateProps {
  Data: AdminDataDashboardData;
}
