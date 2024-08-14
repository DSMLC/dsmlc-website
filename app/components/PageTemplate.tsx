import React from "react";

interface PageData {
  header: string;
  text: string;
}

const PageTemplate = ({ Data }: { Data: PageData[] }) => {
  return (
    <div className="flex flex-col items-start max-w-3xl m-auto my-20 gap-14">
      {Data.map((data) => {
        return (
          <div className="flex gap-2 flex-col mx-16">
            <div className="text-3xl text-dsmlcDataOrange font-bold">
              {data.header}
            </div>{" "}
            <div dangerouslySetInnerHTML={{ __html: data.text }}></div>
          </div>
        );
      })}
    </div>
  );
};

export default PageTemplate;
