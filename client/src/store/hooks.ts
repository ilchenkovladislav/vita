import {
    ActionCreatorsMapObject,
    bindActionCreators,
    createAsyncThunk,
} from '@reduxjs/toolkit';
import { useMemo } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootStore } from './types';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useStateSelector: TypedUseSelectorHook<RootStore> = useSelector;

export const useActionCreators = (actions: ActionCreatorsMapObject) => {
    const dispatch = useAppDispatch();

    return useMemo(() => bindActionCreators(actions, dispatch), []);
};

export const useAsyncThunk = () =>
    createAsyncThunk.withTypes<{
        rejectValue: string;
        state: RootStore;
    }>();
