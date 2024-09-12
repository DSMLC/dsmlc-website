import React from "react";
import { ProfileListTemplate } from "../components/ProfileListTemplate";
import VisionaryTeam from "../../public/data/execs.json";
import VisionaryLabData from "../../public/data/page_data/visionary_lab.json";
import TitleTemplate from "../components/TitleTemplate";
import HeaderTextTemplate2 from "../components/HeaderTextTemplate2";

const page = () => {
  return (
    <div>
      <TitleTemplate
        Title={VisionaryLabData.title_template.title}
        Subtitle={VisionaryLabData.title_template.subtitle}
      />
      <HeaderTextTemplate2 Data={VisionaryLabData.header_text_template} />
      <ProfileListTemplate
        ProfilesData={VisionaryTeam}
        GroupRoleTitle={VisionaryLabData.group_roles}
      />
    </div>
  );
};

export default page;
