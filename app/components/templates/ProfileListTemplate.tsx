import React from "react";
import Image from "next/image";
import EmptyProfie from "../../../public/images/profile/empty_profile.svg";
import SubtitleTemplate from "./SubtitleTemplate";
import Execs from "../../../public/data/execs.json";

export const ProfileListTemplate = ({
  GroupRoleTitle,
}: {
  GroupRoleTitle: string[];
}) => {
  return (
    <div>
      {GroupRoleTitle.map((roleGroup) => {
        return (
          <div className="flex flex-col gap-10 lg:px-0 py-10 lg:pt-11 lg:w-full max-w-4xl w-fit m-auto lg:text-start text-center">
            <SubtitleTemplate Subtitle={roleGroup} />
            <div className="grid md:grid-cols-3 grid-cols-2 gap-10">
              {Execs.filter((exec) =>
                exec.role.some(
                  (role) => role.group == roleGroup && role.roles.length > 0
                )
              ).map((filteredExec) => {
                return (
                  <div className="flex flex-col gap-1 text-center justify-between">
                    <Image
                      src={filteredExec.profile || EmptyProfie || ""}
                      alt="Executive Profile Picture"
                      width={999}
                      height={999}
                      className={`${
                        filteredExec.profile
                          ? "object-cover"
                          : "object-contain p-4"
                      } self-center object-center md:w-32 md:h-32 w-24 h-24 border-4 border-dsmlcTangerine rounded-4xl`}
                    />
                    <span className="font-bold font-redHat text-xl text-dsmlcTangerine">
                      {filteredExec.name}
                    </span>{" "}
                    {filteredExec.program && (
                      <span className="text-sm italic flex flex-wrap items-center justify-center px-2">
                        {filteredExec.program?.year}
                        {filteredExec.program?.programs?.length > 0 &&
                          filteredExec.program?.programs.map((program) => {
                            return (
                              <div key={program} className="ml-1">
                                {program}
                              </div>
                            );
                          })}
                      </span>
                    )}
                    {filteredExec.role
                      .filter((role) => role.group === roleGroup)
                      .map((role) =>
                        role.roles.map((roleTitle, index) => (
                          <span
                            className="border-b-2 w-fit self-center border-dsmlcTangerine text-dsmlcBlack font-semibold"
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
