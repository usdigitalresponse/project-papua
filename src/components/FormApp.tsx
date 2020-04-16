import React, { useState, useContext } from "react";
import { Card, Button } from "./helper-components/index";
import { Box } from "grommet";
import { initializeForm } from "../forms";
import Sidebar from "./Sidebar";
import Introduction from "./Introduction";
import Review from "./Review";
import Form from "./Form";
import { LanguageContext } from "../contexts/language";
import { translate, getCopy } from "../forms/index";

import { FormContext, Values, Errors, Value } from '../contexts/form'

interface FormValues {
  [questionId: string]: string
}

const FormApp: React.FC<{}> = () => {
  const { language } = useContext(LanguageContext);
  const form = initializeForm();

  const { pages, seal } = form;

  const pageTitles = [
    translate(getCopy("introduction"), language),
    ...pages.map((page) => translate(page.title, language)),
    translate(getCopy("submit"), language),
  ];
  const pageComponents = [
    <Introduction />,
    ...pages.map((page) => <Form page={page} />),
    <Review />,
  ];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [formValues, setFormValues] = useState<Values>({});
  const [formErrors, setFormErrors] = useState<Errors>({})

  const setFormValue = (key: string, value: Value) => setFormValues({ ...formValues, [key]: value })
  const setFormError = (key: string, value: string) => setFormErrors({ ...formErrors, [key]: value })

  const setNextPage = (index: number) => {
    setCurrentIndex(index);
    window.scrollTo(0, 0);
  };

  const onClickNext = () => setNextPage(currentIndex + 1);
  const onClickBack = () => setNextPage(currentIndex - 1);

  return (
    <Box align="center" pad="medium" direction="column">
      <Card margin={{ bottom: "small" }} pad="small" background="white">
        {translate(getCopy("demo-warning"), language)}
      </Card>
      <Box width="100%" height="100%" justify="center" direction="row">
        <Card
          width="50%"
          background="white"
          display="flex"
          justify="between"
          flexDirection="column"
          textAlign="left"
        >
          <FormContext.Provider value={{ setError: setFormError, setValue: setFormValue, values: formValues, errors: formErrors }}>
            {pageComponents[currentIndex]}
          </FormContext.Provider>
          <Box justify="between" pad="medium" direction="row">
            {currentIndex > 0 && (
              <Button
                border={{ radius: 0 }}
                color="black !important"
                onClick={onClickBack}
                label={translate(getCopy("back"), language)}
              />
            )}
            {currentIndex + 1 < pageTitles.length && (
              <Button
                color="black !important"
                onClick={onClickNext}
                label={
                  currentIndex === 0
                    ? translate(getCopy("get-started"), language)
                    : translate(getCopy("next"), language)
                }
              />
            )}
          </Box>
        </Card>
        <Sidebar
          seal={seal}
          pages={pageTitles}
          currentIndex={currentIndex}
          setCurrentIndex={setNextPage}
        />
      </Box>
    </Box>
  );
};

export default FormApp;
