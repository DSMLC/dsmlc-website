import React from "react";
import { ProfileListTemplate } from "../components/ProfileListTemplate";
import VisionaryTeam from "../../public/data/execs.json";
import GroupRoleTitles from "../../public/data/page_data/visionary_lab.json";

const page = () => {
  return (
    <div>
      <ProfileListTemplate
        ProfilesData={VisionaryTeam}
        GroupRoleTitle={GroupRoleTitles}
      />
    </div>
  );
};

export default page;
