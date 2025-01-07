"use client";
import React, { useEffect, useState } from "react";
import ColumnTemplate from "./components/templates/ColumnTemplate";
import TimelineTemplate1 from "./components/templates/TimelineTemplate1";
import FAQTemplate from "./components/templates/FAQTemplate";
import ApplicationTemplate from "./components/templates/ApplicationTemplate";
import HeroTemplate from "./components/templates/HeroTemplate";
import HeaderTextSubSectionTemplate from "./components/templates/HeaderTextSubSectionTemplate";
import HeaderTextTemplate1 from "./components/templates/HeaderTextTemplate1";
import HeaderTextTemplate2 from "./components/templates/HeaderTextTemplate2";
import HeaderTextTemplate3 from "./components/templates/HeaderTextTemplate3";
import HeaderTextTemplate4 from "./components/templates/HeaderTextTemplate4";
import TimelineTemplate2 from "./components/templates/TimelineTemplate2";
import { ProfileListTemplate } from "./components/templates/ProfileListTemplate";
import SubtitleTemplate1 from "./components/templates/SubtitleTemplate1";
import SubtitleTemplate2 from "./components/templates/SubtitleTemplate2";
import SubtitleTemplate3 from "./components/templates/SubtitleTemplate3";
import InfoBubbleTemplate from "./components/templates/InfoBubbleTemplate";
import TitleTemplate2 from "./components/templates/TitleTemplate2";
import TitleTemplate1 from "./components/templates/TitleTemplate1";
import CarouselTemplate from "./components/templates/CarouselTemplate";
import BackgroundFillTemplate from "./components/templates/BackgroundFillTemplate";
import IncreasingNumbersTemplate from "./components/templates/IncreasingNumbersTemplate";
import BackgroundFillTemplate2 from "./components/templates/BackgroundFillTemplate2";
import SocialLinksTemplate from "./components/templates/SocialLinksTemplate";

export interface ImageData {
  imageLink?: string;
  imageDarkMode?: string;
  imageName?: string;
  imageType?: string;
}

export interface ApplicationTemplateData {
  type: "ApplicationTemplate";
  data: { link: string; name: string }[];
}

export interface BackgroundFillTemplateData {
  type: "BackgroundFillTemplate";
  data: PageData[];
}

export interface BackgroundFillTemplateData2 {
  type: "BackgroundFillTemplate2";
  data: PageData[];
}

export interface CarouselTemplateData {
  type: "CarouselTemplate";
  data: {
    header: string;
    points: {
      header: string;
      text: string;
    }[];
    image?: ImageData;
  }[];
}

export interface ColumnTemplateData {
  type: "ColumnTemplate";
  data: {
    header?: string;
    text?: string;
    image?: ImageData;
  }[];
}

export interface FAQTemplateData {
  type: "FAQTemplate";
  data: {
    header: string;
    faq: { question: string; answer: string }[];
  };
}

export interface HeaderTextTemplateData1 {
  type: "HeaderTextTemplate1";
  data: { header: string; text: string }[];
}

export interface HeaderTextTemplateData2 {
  type: "HeaderTextTemplate2";
  data: { header: string; text: string }[];
}

export interface HeaderTextTemplateData3 {
  type: "HeaderTextTemplate3";
  data: { header: string; text: string }[];
}

export interface HeaderTextTemplateData4 {
  type: "HeaderTextTemplate4";
  data: { header: string; text?: string[] }[];
}

export interface HeaderTextSubSectionTemplateData {
  type: "HeaderTextSubSectionTemplate";
  data: { title: string; subSection: { header: string; text?: string }[] }[];
}

export interface HeroTemplateData {
  type: "HeroTemplate";
  data: {
    name: string;
    acronym?: string;
    acronym_styled?: string;
    name_styled?: string;
    superscript_name?: string;
    description?: string;
    logo?: {
      light_logo: string;
      dark_logo: string;
    };
  }[];
}

export interface InfoBubbleTemplateData {
  type: "InfoBubbleTemplate";
  data: {
    title: string;
    text: string;
    image?: ImageData;
  }[];
}

export interface IncreasingNumbersData {
  type: "IncreasingNumbersTemplate";
  data: {
    value: number;
    title: string;
    unit?: string;
  }[];
}

export interface ProfileListTemplateData {
  type: "ProfileListTemplate";
  data: string[];
}

export interface SubtitleTemplateData1 {
  type: "SubtitleTemplate1";
  data: string;
}

export interface SubtitleTemplateData2 {
  type: "SubtitleTemplate2";
  data: string;
}

export interface SubtitleTemplateData3 {
  type: "SubtitleTemplate3";
  data: string;
}

export interface TimelineTemplateData1 {
  type: "TimelineTemplate1";
  data: {
    number: string;
    header: string;
    points: {
      header: string;
      text: string;
    }[];
    image?: ImageData;
  }[];
}

export interface TimelineTemplateData2 {
  type: "TimelineTemplate2";
  data: {
    number: string;
    header: string;
    points: { header: string; text: string }[];
  }[];
}

export interface TitleTemplateData1 {
  type: "TitleTemplate1";
  data: {
    title: string;
    subtitle?: string;
  };
}

export interface TitleTemplateData2 {
  type: "TitleTemplate2";
  data: {
    title: string;
    subtitle?: string;
  };
}

export interface SocialLinksTemplateData {
  type: "SocialLinksTemplate";
  data: {};
}

export type PageData =
  | ColumnTemplateData
  | CarouselTemplateData
  | TitleTemplateData1
  | TitleTemplateData2
  | TimelineTemplateData1
  | TimelineTemplateData2
  | FAQTemplateData
  | ApplicationTemplateData
  | HeroTemplateData
  | InfoBubbleTemplateData
  | HeaderTextSubSectionTemplateData
  | HeaderTextTemplateData1
  | HeaderTextTemplateData2
  | HeaderTextTemplateData3
  | HeaderTextTemplateData4
  | ProfileListTemplateData
  | SubtitleTemplateData1
  | SubtitleTemplateData2
  | SubtitleTemplateData3
  | BackgroundFillTemplateData
  | BackgroundFillTemplateData2
  | SocialLinksTemplateData
  | IncreasingNumbersData;

export const templateMap: {
  [key in PageData["type"]]?: React.ComponentType<{
    Data: any;
    templateMap?: any;
  }>;
} = {
  ColumnTemplate: ColumnTemplate,
  TitleTemplate1: TitleTemplate1,
  TitleTemplate2: TitleTemplate2,
  TimelineTemplate1: TimelineTemplate1,
  TimelineTemplate2: TimelineTemplate2,
  FAQTemplate: FAQTemplate,
  ApplicationTemplate: ApplicationTemplate,
  HeroTemplate: HeroTemplate,
  InfoBubbleTemplate: InfoBubbleTemplate,
  HeaderTextSubSectionTemplate: HeaderTextSubSectionTemplate,
  HeaderTextTemplate1: HeaderTextTemplate1,
  HeaderTextTemplate2: HeaderTextTemplate2,
  HeaderTextTemplate3: HeaderTextTemplate3,
  HeaderTextTemplate4: HeaderTextTemplate4,
  ProfileListTemplate: ProfileListTemplate,
  SubtitleTemplate1: SubtitleTemplate1,
  SubtitleTemplate2: SubtitleTemplate2,
  SubtitleTemplate3: SubtitleTemplate3,
  CarouselTemplate: CarouselTemplate,
  BackgroundFillTemplate: BackgroundFillTemplate,
  BackgroundFillTemplate2: BackgroundFillTemplate2,
  IncreasingNumbersTemplate: IncreasingNumbersTemplate,
  SocialLinksTemplate: SocialLinksTemplate,
};

const resolveData = async (pageData: PageData): Promise<any> => {
  if (
    typeof pageData.data === "object" &&
    pageData.data !== null &&
    "json" in pageData.data &&
    "keys" in pageData.data
  ) {
    const { json, keys } = pageData.data as unknown as {
      json: string;
      keys: string[];
    };

    if (json.endsWith(".json")) {
      try {
        const importedData = await import(`../public/data/${json}`);
        let combinedData = keys
          .map((key) => importedData.default?.[key])
          .filter(Boolean)
          .flat();

        // Sort combinedData by the date
        if (json === "upcoming_events.json") {
          combinedData = combinedData.sort((a, b) => {
            const dateA = a.title
              ? new Date(a.title.replace(/(\d+)(st|nd|rd|th)/, "$1"))
              : new Date(0); // Default to an old date if title is missing
            const dateB = b.title
              ? new Date(b.title.replace(/(\d+)(st|nd|rd|th)/, "$1"))
              : new Date(0); // Default to an old date if title is missing

            return dateA.getTime() - dateB.getTime();
          });
        }

        return combinedData;
      } catch (error) {
        console.error(`Error loading JSON file: ${json}`, error);
        return null;
      }
    }
  }

  if (
    (pageData.type === "BackgroundFillTemplate" ||
      pageData.type === "BackgroundFillTemplate2") &&
    Array.isArray(pageData.data)
  ) {
    const resolvedNestedData = await Promise.all(
      pageData.data.map(async (nestedPageData: PageData) => {
        const resolvedNested = await resolveData(nestedPageData);
        return { ...nestedPageData, data: resolvedNested };
      })
    );
    return resolvedNestedData;
  }

  return pageData.data;
};

const DataLoader = ({ pageData }: { pageData: PageData }) => {
  const [resolvedData, setResolvedData] = useState<any>(null);
  const TemplateComponent = templateMap[pageData.type];

  useEffect(() => {
    const loadData = async () => {
      const data = await resolveData(pageData);
      setResolvedData(data);
    };

    loadData();
  }, [pageData]);

  if (!TemplateComponent) {
    return <div>Unsupported data type</div>;
  }

  if (resolvedData === null) {
    return (
      <div className="w-screen text-center font-redHat font-bold text-xl text-dark-dsmlcBlack dark:text-dark-dsmlcBlack">
        Loading...
      </div>
    );
  }

  if (!resolvedData) {
    return <div>Data not found for {pageData.type}</div>;
  }

  if (
    pageData.type === "BackgroundFillTemplate" ||
    pageData.type === "BackgroundFillTemplate2"
  ) {
    return (
      <TemplateComponent
        Data={resolvedData}
        templateMap={templateMap} // Only pass map for this template
      />
    );
  }

  return <TemplateComponent Data={resolvedData} />;
};

export default DataLoader;
