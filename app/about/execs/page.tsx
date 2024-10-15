import React from "react";
import ExecutiveRosterData from "../../../public/data/page_data/executive_roster.json";
import { ProfileListTemplate } from "../../components/templates/ProfileListTemplate";
import TitleTemplate from "../../components/templates/TitleTemplate";

const page = () => {
  return (
    <div>
      <TitleTemplate Data={ExecutiveRosterData.title_template} />
      <ProfileListTemplate
        GroupRoleTitle={ExecutiveRosterData.group_roles}
      />
    </div>
  );
};

export default page;
