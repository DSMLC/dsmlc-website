import React from "react";
import Execs from "../../../public/data/execs.json";
import GroupRoleTitles from "../../../public/data/page_data/executive_roster.json";
import { ProfileListTemplate } from "@/app/components/ProfileListTemplate";

const page = () => {
  return (
    <div className="flex justify-center items-center flex-col gap-12">
      <ProfileListTemplate
        ProfilesData={Execs}
        GroupRoleTitle={GroupRoleTitles}
      />
    </div>
  );
};

export default page;
