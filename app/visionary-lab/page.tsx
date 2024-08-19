import React from "react";
import { ProfileListTemplate } from "../components/ProfileListTemplate";
import VisionaryTeam from "../../public/data/execs.json";
import VisionaryLabData from "../../public/data/page_data/visionary_lab.json";
import TitleTemplate from "../components/TitleTemplate";

const page = () => {
  return (
    <div>
      <TitleTemplate Title={VisionaryLabData.title} />
      <ProfileListTemplate
        ProfilesData={VisionaryTeam}
        GroupRoleTitle={VisionaryLabData.group_roles}
      />
    </div>
  );
};

export default page;
