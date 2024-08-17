import React from "react";
import { ProfileListTemplate } from "../components/ProfileListTemplate";
import VisionaryTeam from "../../public/data/visionary_team.json";

const page = () => {
  return (
    <div>
      <ProfileListTemplate ProfilesData={VisionaryTeam} />
    </div>
  );
};

export default page;
