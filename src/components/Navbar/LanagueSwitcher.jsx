import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Select from "../common/neomorphic/Select";
import { useDispatch, useSelector } from "react-redux";
import { changeLangauge } from "../../slice/authSlice";

const languageOptions = [
  { label: "English", value: "en" },
  { label: "मराठी", value: "mr" },
  { label: "हिन्दी", value: "hi" },
  { label: "العربية", value: "ar" },
];

function LanguageSwitcher() {
  // return <div>Hi</div>
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const handleLangaugeChange = (selectedLanguage) => {
    i18n.changeLanguage(selectedLanguage);
    dispatch(changeLangauge(selectedLanguage));
    localStorage.setItem("language", selectedLanguage);
  };
  useEffect(() => {
    if (localStorage.getItem("language")) {
      handleLangaugeChange(localStorage.getItem("language"));
    }
  }, []);

  return (
    <Select
      native={false}
      label="Select Language"
      value={i18n.language}
      options={languageOptions}
      className={"mr-5 background-transparent"}
      onChange={(selectedOption) => handleLangaugeChange(selectedOption.value)}
    />
  );
}

export default LanguageSwitcher;
