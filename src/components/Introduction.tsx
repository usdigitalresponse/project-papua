import React, { useContext } from "react";
import { Box, Heading, Paragraph, Text } from "grommet";
import { translate, getCopy } from "../forms/index";
import { LanguageContext } from "../contexts/language";

const Introduction: React.FC = () => {
  const { language } = useContext(LanguageContext);

  return (
    <>
      <Box pad="medium">
        <Heading
          level={3}
          color="black"
          margin={{ top: "none", bottom: "none" }}
        >
          {translate(getCopy("welcome"), language)}
        </Heading>
        <Paragraph fill={true} color="black">
          {translate(getCopy("intro-1"), language)}
          <br />
          <br />
          {translate(getCopy("intro-2"), language)}
          <br />
          <br />
          {translate(getCopy("intro-3"), language)}
          <br />
          <br />
          <Text weight={600}>{translate(getCopy("prereqs"), language)}</Text>
          <ol color="black">
            <li color="black">{translate(getCopy("prereqs:ssn"), language)}</li>
            <li color="black">{translate(getCopy("prereqs:agi"), language)}</li>
            <li color="black">
              {translate(getCopy("prereqs:employment"), language)}
            </li>
            <li color="black">{translate(getCopy("prereqs:arn"), language)}</li>
            <li color="black">
              {translate(getCopy("prereqs:children"), language)}
            </li>
            <li color="black">
              {translate(getCopy("prereqs:license"), language)}
            </li>
            <li color="black">
              {translate(getCopy("prereqs:bank"), language)}
            </li>
          </ol>
        </Paragraph>
      </Box>
      <Box style={{ position: "relative" }}>
        <Box
          style={{
            position: "absolute",
            height: "100%",
            width: "8px",
            backgroundColor: "#FFAE00",
          }}
        />
        <Box pad={{ vertical: "none", horizontal: "medium" }}>
          <Paragraph color="black" fill={true}>
            <Text color="black" weight={600}>
              {translate(getCopy("warning"), language)}:
            </Text>
            <br />
            {translate(getCopy("warning:content-1"), language)}
            <br />
            <br />
            {translate(getCopy("warning:content-2"), language)}
          </Paragraph>
        </Box>
      </Box>
    </>
  );
};

export default Introduction;
