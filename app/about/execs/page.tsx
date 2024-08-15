import React from "react";
import Execs from "../../../public/data/execs.json";

const page = () => {
  return (
    <div className="h-screen flex justify-center items-center flex-col gap-10  pt-16">
      {Execs[0].role.map((roleGroup) => {
        return (
          <div className="flex gap-5 flex-col">
            <span className="text-4xl font-redHat">{roleGroup.group}</span>
            <div className="flex flex-row gap-10">
              {Execs.filter((exec) =>
                exec.role.some(
                  (role) =>
                    role.group == roleGroup.group && role.roles.length > 0
                )
              ).map((filteredExec) => {
                return (
                  <div className="">
                    <div>{filteredExec.name}</div>
                    {filteredExec.role
                      .filter((role) => role.group === roleGroup.group)
                      .map((role) =>
                        role.roles.map((roleTitle, index) => (
                          <div key={index}>{roleTitle}</div>
                        ))
                      )}
                    <div>{filteredExec.bio}</div>
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

export default page;
