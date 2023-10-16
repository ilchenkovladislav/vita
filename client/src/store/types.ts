import type { store } from './root';

export type RootStore = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface ServerResponse {
    status: number;
    message: string;
    records?: unknown[];
}

export interface Page {
    id: number;
    title: string;
    link: string;
    sections: Section[];
    theme?: string;
}

export interface Section {
    id: number;
    title: string;
    comment: string;
    sequence: number;
    pageId: number;
}

export interface Image {
    id: number;
    path: string;
    sectionId: number;
}

export type StateStatus = 'init' | 'loading' | 'error' | 'success';
