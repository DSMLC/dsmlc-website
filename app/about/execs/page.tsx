import React from "react";
import Execs from "../../../public/data/execs.json";
import ExecutiveRosterData from "../../../public/data/page_data/executive_roster.json";
import { ProfileListTemplate } from "../../components/templates/ProfileListTemplate";
import TitleTemplate from "../../components/templates/TitleTemplate";

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
