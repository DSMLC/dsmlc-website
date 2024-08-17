import React from "react";
import Image from "next/image";
import Execs from "../../../public/data/execs.json";
import { ProfileListTemplate } from "@/app/components/ProfileListTemplate";

const page = () => {
  return (
    <div className="flex justify-center items-center flex-col gap-12 bg-dsmlcParchment">
      <ProfileListTemplate ProfilesData={Execs} />
    </div>
  );
};

export default page;
