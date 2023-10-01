import { useContext } from 'react';
import {
    STORAGE_THEME_KEY,
    Theme,
    ThemeContext,
} from '../contexts/ThemeContext.ts';

export const useTheme = () => {
    const { theme, setTheme } = useContext(ThemeContext);

    const toggleTheme = () => {
        const newTheme = theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
        setTheme(newTheme);
        document.documentElement.dataset.theme = newTheme;
        localStorage.setItem(STORAGE_THEME_KEY, newTheme);
    };

    return { theme, toggleTheme };
};
