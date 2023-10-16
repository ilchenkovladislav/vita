import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import { BsFillMoonFill, BsFillSunFill } from 'react-icons/bs';

import { Theme } from '../../contexts/ThemeContext';
import './Header.scss';
import { useTheme } from '../../hooks/useTheme.ts';

export const Header = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="header">
            <Toggle
                checked={theme === Theme.LIGHT}
                className="header__toggle"
                icons={{
                    checked: <BsFillSunFill />,
                    unchecked: <BsFillMoonFill />,
                }}
                onChange={toggleTheme}
            />
        </div>
    );
};
