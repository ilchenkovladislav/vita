import React from 'react';

export enum Theme {
    DARK = 'dark',
    LIGHT = 'light',
}

export interface ThemeContextProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

export const ThemeContext = React.createContext<ThemeContextProps>({
    theme: Theme.LIGHT,
    setTheme: (theme) => theme,
});

export const STORAGE_THEME_KEY = 'theme';
