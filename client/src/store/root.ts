import { configureStore } from '@reduxjs/toolkit';
import { pageReducer } from './slices/pageSlice';

export const store = configureStore({
    reducer: {
        pages: pageReducer,
    },
});
