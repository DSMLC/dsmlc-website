import React from "react";
import Image from "next/image";

interface ProfileList {
  name: string;
  role: {
    group: string;
    roles: string[];
  }[];
  profile?: string;
  program?: string;
  bio?: string;
}

export const ProfileListTemplate = ({
  ProfilesData,
}: {
  ProfilesData: ProfileList[];
}) => {
  return (
    <div>
      {ProfilesData[0].role.map((roleGroup) => {
        return (
          <div className="flex flex-col w-full max-w-4xl m-auto p-14 py-5 gap-10">
            <span className="text-4xl font-redHat text-dsmlcDataOrange font-bold md:text-start text-center">
              {roleGroup.group}
            </span>
            <div className="flex flex-row gap-10 flex-wrap justify-between">
              {ProfilesData.filter((exec) =>
                exec.role.some(
                  (role) =>
                    role.group == roleGroup.group && role.roles.length > 0
                )
              ).map((filteredExec) => {
                return (
                  <div className="flex flex-col gap-1 md:w-1/4 w-5/12 text-center justify-between">
                    <Image
                      src={
                        filteredExec.profile || ProfilesData[0].profile || ""
                      }
                      alt="Executive Profile Picture"
                      width={999}
                      height={999}
                      className={`${
                        filteredExec.profile
                          ? "object-cover"
                          : "object-contain p-4"
                      } self-center object-center md:w-32 md:h-32 w-24 h-24 border-4 border-dsmlcTangerine rounded-4xl`}
                    />
                    <span className="font-bold font-redHat text-xl text-dsmlcDataOrange">
                      {filteredExec.name}
                    </span>
                    <span className="text-sm italic ">
                      {filteredExec.program}
                    </span>
                    {filteredExec.role
                      .filter((role) => role.group === roleGroup.group)
                      .map((role) =>
                        role.roles.map((roleTitle, index) => (
                          <span
                            className="border-b-2 border-dsmlcTangerine text-dsmlcDarkBlack font-semibold"
                            key={index}
                          >
                            {roleTitle}
                          </span>
                        ))
                      )}
                    {/* {(roleGroup.group === "Operations Team" ||
                      roleGroup.group === "Admin Team") && (
                      <div>{filteredExec.bio}</div>
                    )} */}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
