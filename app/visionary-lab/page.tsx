import React from "react";
import { ProfileListTemplate } from "../components/templates/ProfileListTemplate";
import VisionaryLabData from "../../public/data/page_data/visionary_lab.json";
import TitleTemplate from "../components/templates/TitleTemplate";
import HeaderTextTemplate2 from "../components/templates/HeaderTextTemplate2";
import HeroTemplate from "../components/templates/HeroTemplate";
import LogoData from "../../public/data/logo.json";

const page = () => {
  return (
    <div>
      <HeroTemplate Data={LogoData.visionary_lab_logo} />
      <TitleTemplate
        Title={VisionaryLabData.title_template.title}
        Subtitle={VisionaryLabData.title_template.subtitle}
      />
      <HeaderTextTemplate2 Data={VisionaryLabData.header_text_template} />
      <ProfileListTemplate GroupRoleTitle={VisionaryLabData.group_roles} />
    </div>
  );
};

export default page;
