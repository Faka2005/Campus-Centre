import * as React from "react";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import IconButton from "@mui/material/IconButton";
import { GetTheme, ToggleTheme } from "../../utils/Storagelocal";

export default function ThemeButton() {
  const [theme, setTheme] = React.useState(GetTheme());

  const handleToggle = () => {
    const newTheme = ToggleTheme();
    setTheme(newTheme);

    // Optionnel : appliquer une classe au <body> pour le thème
    document.body.setAttribute("data-theme", newTheme);
  };

  return (
    <IconButton onClick={handleToggle} color="inherit">
      {theme === "dark" ? <LightModeIcon  color="primary"  /> : <DarkModeIcon  color="primary"/>}
    </IconButton>
  );
}
