import React from "react";
import ColumnTemplate from "./components/templates/ColumnTemplate";
import TimelineTemplate1 from "./components/templates/TimelineTemplate1";
import FAQTemplate from "./components/templates/FAQTemplate";
import ApplicationTemplate from "./components/templates/ApplicationTemplate";
import HeroTemplate from "./components/templates/HeroTemplate";
import HeaderTextTemplate2 from "./components/templates/HeaderTextTemplate2";
import HeaderTextTemplate1 from "./components/templates/HeaderTextTemplate1";
import TimelineTemplate2 from "./components/templates/TimelineTemplate2";
import { ProfileListTemplate } from "./components/templates/ProfileListTemplate";
import SectionedHeaderTemplate from "./components/templates/SectionedHeaderTemplate";
import SubHeaderTextTemplate from "./components/templates/SubHeaderTextTemplate";
import SubtitleTemplate1 from "./components/templates/SubtitleTemplate1";
import SubtitleTemplate2 from "./components/templates/SubtitleTemplate2";
import SubtitleTemplate3 from "./components/templates/SubtitleTemplate3";
import logoData from "../public/data/logo.json";
import InfoBubbleTemplate from "./components/templates/InfoBubbleTemplate";
import TitleTemplate2 from "./components/templates/TitleTemplate2";
import TitleTemplate1 from "./components/templates/TitleTemplate1";
import CarouselTemplate from "./components/templates/CarouselTemplate";

export interface ApplicationTemplateData {
  type: "ApplicationTemplate";
  data: {
    title: string;
    descriptions: string[];
    bullets?: {
      bulletsTitle?: string;
      bullets?: {
        title: string;
        text: string;
        link?: { linkName: string; link: string };
      }[];
    };
    button?: { buttonLink: string; buttonText: string };
  };
}

export interface CarouselTemplateData {
  type: "CarouselTemplate";
  data: {
    image: {
      imageLink?: string;
      imageName?: string;
      imageType?: string;
    }[];
    interval?: number;
  };
}

export interface ColumnTemplateData {
  type: "ColumnTemplate";
  data: {
    header: string;
    text: string;
    image?: {
      imageLink?: string;
      imageName?: string;
      imageType?: string;
    };
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
  };
}

export interface InfoBubbleTemplateData {
  type: "InfoBubbleTemplate";
  data: {
    title: string;
    text: string;
    image?: {
      imageLink?: string;
      imageName?: string;
      imageType?: string;
    };
  }[];
}

export interface ProfileListTemplateData {
  type: "ProfileListTemplate";
  data: string[];
}

export interface SectionedHeaderTemplateData {
  type: "SectionedHeaderTemplate";
  data: {
    header: string;
    subheaders: {
      header: string;
      text: string;
    }[];
  }[];
}

export interface SubHeaderTextTemplateData {
  type: "SubHeaderTextTemplate";
  data: { header: string; text: string }[];
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
    image?: {
      imageLink?: string;
      imageName?: string;
      imageType?: string;
    };
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
  | HeaderTextTemplateData1
  | HeaderTextTemplateData2
  | ProfileListTemplateData
  | SectionedHeaderTemplateData
  | SubHeaderTextTemplateData
  | SubtitleTemplateData1
  | SubtitleTemplateData2
  | SubtitleTemplateData3;

const templateMap: {
  [key in PageData["type"]]?: React.ComponentType<{ Data: any }>;
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
  HeaderTextTemplate1: HeaderTextTemplate1,
  HeaderTextTemplate2: HeaderTextTemplate2,
  ProfileListTemplate: ProfileListTemplate,
  SectionedHeaderTemplate: SectionedHeaderTemplate,
  SubHeaderTextTemplate: SubHeaderTextTemplate,
  SubtitleTemplate1: SubtitleTemplate1,
  SubtitleTemplate2: SubtitleTemplate2,
  SubtitleTemplate3: SubtitleTemplate3,
  CarouselTemplate: CarouselTemplate,
};

const resolveData = (pageData: PageData): any => {
  if (pageData.type === "HeroTemplate" && typeof pageData.data === "string") {
    const logoKey = pageData.data;
    const heroData = logoData[logoKey];

    if (heroData) {
      return heroData;
    } else {
      console.error(`Logo data for key "${logoKey}" not found.`);
      return null;
    }
  }
  return pageData.data;
};

const DataLoader = ({ pageData }: { pageData: PageData }) => {
  const TemplateComponent = templateMap[pageData.type];
  const resolvedData = resolveData(pageData);

  if (!TemplateComponent) {
    return <div>Unsupported data type</div>;
  }

  if (!resolvedData) {
    return <div>Data not found for {pageData.type}</div>;
  }

  return <TemplateComponent Data={resolvedData} />;
};

export default DataLoader;
