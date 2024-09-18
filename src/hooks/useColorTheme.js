import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { changeTheme } from "../slice/authSlice";

const useColorTheme = () => {
  let [isDarkTheme, setIsDarkTheme] = useState(false);
  const dispatch = useDispatch();

  const handleThemeSwitch = (theme) => {
    dispatch(changeTheme(theme ? "dark" : "light"));
    document.documentElement.setAttribute(
      "data-theme",
      theme ? "dark" : "light"
    );
    localStorage.setItem("theme", theme ? "dark" : "light");
    setIsDarkTheme(theme);
  };

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      setIsDarkTheme(true);
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
      setIsDarkTheme(false);
    }
  }, []);

  return {
    isDarkTheme,
    handleThemeSwitch,
  };
};

export default useColorTheme;
