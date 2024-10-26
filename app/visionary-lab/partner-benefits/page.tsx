import React from "react";
import TitleTemplate from "../../components/templates/TitleTemplate";
import partnerBenefitsData from "../../../public/data/page_data/partner_benefits.json";
import HeaderTextTemplate from "../../components/templates/HeaderTextTemplate";
import HeaderTextTemplate2 from "../../components/templates/HeaderTextTemplate2";
import FAQTemplate from "../../components/templates/FAQTemplate";
import ColumnTemplate from "../../components/templates/ColumnTemplate";
import TimelineTemplate from "@/app/components/templates/TimelineTemplate";

const page = () => {
  return (
    <div>
      <TitleTemplate Data={partnerBenefitsData.title_template} />
      <HeaderTextTemplate2 Data={partnerBenefitsData.text_header_template} />
      <ColumnTemplate Data={partnerBenefitsData.columns_template} />
      <HeaderTextTemplate2
        Data={partnerBenefitsData.timleline_header_text_template}
      />
      <TimelineTemplate Data={partnerBenefitsData.timeline_template} />
      <FAQTemplate Data={partnerBenefitsData.faq_template} />
    </div>
  );
};

export default page;
