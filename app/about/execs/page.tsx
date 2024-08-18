import React from "react";
import Execs from "../../../public/data/execs.json";
import ExecutiveRosterData from "../../../public/data/page_data/executive_roster.json";
import { ProfileListTemplate } from "@/app/components/ProfileListTemplate";
import TitleTemplate from "@/app/components/TitleTemplate";

const page = () => {
  return (
    <div>
      <TitleTemplate Title={ExecutiveRosterData.title} />
      <ProfileListTemplate
        ProfilesData={Execs}
        GroupRoleTitle={ExecutiveRosterData.group_roles}
      />
    </div>
  );
};

export default page;
