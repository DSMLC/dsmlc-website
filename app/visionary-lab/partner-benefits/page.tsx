import React from "react";
import TitleTemplate from "../../components/templates/TitleTemplate";
import partnerBenefitsData from "../../../public/data/page_data/partner_benefits.json";
import HeaderTextTemplate from "../../components/templates/HeaderTextTemplate";
import HeaderTextTemplate2 from "../../components/templates/HeaderTextTemplate2";

const page = () => {
  return (
    <div>
      <TitleTemplate Data={partnerBenefitsData.title_template} />
      <HeaderTextTemplate2 Data={partnerBenefitsData.text_header_template} />
    </div>
  );
};

export default page;
