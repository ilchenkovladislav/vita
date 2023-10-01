import { useState } from 'react';
import {
    STORAGE_THEME_KEY,
    Theme,
    ThemeContext,
} from '../contexts/ThemeContext';

const getDefaultTheme = (): Theme => {
    const theme = localStorage.getItem(STORAGE_THEME_KEY);
    if (Object.values(Theme).includes(theme as Theme)) return theme as Theme;

    const userMedia = window.matchMedia('(prefers-color-scheme: light)');
    if (userMedia.matches) return Theme.LIGHT;

    return Theme.DARK;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(getDefaultTheme);
    document.documentElement.dataset.theme = theme;

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
