import Toggle from "react-toggle";
import "react-toggle/style.css";
import { BsFillSunFill } from "react-icons/bs";
import { BsFillMoonFill } from "react-icons/bs";

import { ThemeContext, themes } from "../../contexts/ThemeContext";
import "./Header.scss";

export const Header = () => {
  return (
    <ThemeContext.Consumer>
      {({ theme, setTheme }) => (
        <div className="header">
          <Toggle
            checked={theme === themes.light}
            className="header__toggle"
            icons={{
              checked: <BsFillSunFill />,
              unchecked: <BsFillMoonFill />,
            }}
            onChange={() => {
              if (theme === themes.light) setTheme(themes.dark);
              if (theme === themes.dark) setTheme(themes.light);
            }}
          />
        </div>
      )}
    </ThemeContext.Consumer>
  );
};
