import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import {
    RootStore,
    ServerResponse,
    Section,
    StateStatus,
    Image,
} from '../types';
import { baseServerUrl } from '../../config';
import API from '../../services/API.ts';
import { getIndexById } from '../../utility/utility.ts';

// import { transformPage, transformSections } from '../../utility/utility';

const Axios = axios.create({
    baseURL: baseServerUrl,
});

export interface Page {
    id: number;
    title: string;
    link: string;
    sections: Section[];
    theme?: string;
}

interface PageState {
    items: Page[];
    status: StateStatus;
    error: string | unknown;
}

const initialState: PageState = {
    items: [],
    status: 'init',
    error: '',
};

export const pageSlice = createSlice({
    name: 'page',
    initialState,
    reducers: {
        onDragEnd: (state, action) => {
            const { destination, source } = action.payload;

            if (!destination) {
                return;
            }

            if (
                destination.droppableId === source.droppableId &&
                destination.index === source.index
            ) {
                return;
            }

            if (destination.droppableId === source.droppableId) {
                const pageIdx = state.items.findIndex(
                    (p) => p.id === Number(source.droppableId),
                );

                const pages = state.items;

                const pageSections = pages[pageIdx].sections;
                const sourceSection = pageSections[source.index];
                const destinationSection = pageSections[destination.index];

                sourceSection.sequence = destination.index;

                if (source.index < destination.index) {
                    for (const section of pageSections) {
                        if (section.sequence < destination.index) {
                            section.sequence = section.sequence - 1;
                        }
                    }

                    destinationSection.sequence = destination.index - 1;
                }

                // 1 -> 0 2 3 4

                if (source.index > destination.index) {
                    for (const section of pageSections) {
                        if (
                            section.sequence > destination.index &&
                            section.sequence < source.index
                        ) {
                            section.sequence = section.sequence + 1;
                        }
                    }

                    destinationSection.sequence = destination.index + 1;
                }

                pageSections.sort((a, b) => a.sequence - b.sequence);

                API.editSections(pages[pageIdx].sections);
            }

            if (destination.droppableId !== source.droppableId) {
                const sourcePageIdx = state.items.findIndex(
                    (p) => p.id === Number(source.droppableId),
                );

                const destinationPageIdx = state.items.findIndex(
                    (p) => p.id === Number(destination.droppableId),
                );

                const pages = state.items;

                const sectionsSourcePage = pages[sourcePageIdx].sections;
                const sectionsDestinationPage =
                    pages[destinationPageIdx].sections;

                const sourceSection = sectionsSourcePage[source.index];

                sourceSection.sequence = destination.index;
                sourceSection.pageId = Number(destination.droppableId);

                sectionsDestinationPage.push(sourceSection);

                sectionsSourcePage.splice(source.index, 1);

                for (const section of sectionsSourcePage) {
                    if (section.sequence > source.index) {
                        section.sequence = section.sequence - 1;
                    }
                }

                for (const section of sectionsDestinationPage) {
                    if (section.sequence > destination.index) {
                        section.sequence = section.sequence + 1;
                    }
                }

                const destinationSection =
                    sectionsDestinationPage[destination.index];

                if (destination.index !== sectionsDestinationPage.length - 1) {
                    destinationSection.sequence = destination.index + 1;
                }

                sectionsSourcePage.sort((a, b) => a.sequence - b.sequence);
                sectionsDestinationPage.sort((a, b) => a.sequence - b.sequence);

                API.editSections([
                    ...sectionsSourcePage,
                    ...sectionsDestinationPage,
                ]);
            }
        },
    },
    extraReducers(builder) {
        builder.addCase(
            getPages.fulfilled,
            (state, action: PayloadAction<unknown>) => {
                state.status = 'success';

                if (Array.isArray(action.payload)) {
                    state.items = action.payload.reverse().map((page) => ({
                        ...page,
                        sections: page.sections.sort(
                            (a, b) => a.sequence - b.sequence,
                        ),
                    }));
                }
            },
        );

        builder.addCase(
            createPage.fulfilled,
            (state, action: PayloadAction<unknown>) => {
                state.status = 'success';

                if (Array.isArray(action.payload)) {
                    state.items.unshift(...[...action.payload]);
                }
            },
        );

        builder.addCase(
            updatePage.fulfilled,
            (state, action: PayloadAction<unknown>) => {
                state.status = 'success';

                if (Array.isArray(action.payload)) {
                    const updatedPageIndex = state.items.findIndex(
                        (item) => item.id === action.payload[0].id,
                    );

                    state.items[updatedPageIndex] = action.payload[0];
                }
            },
        );

        builder.addCase(
            deletePage.fulfilled,
            (state, action: PayloadAction<unknown>) => {
                state.status = 'success';

                if (Array.isArray(action.payload)) {
                    const deletePageIndex = state.items.findIndex(
                        (item) => item.id === action.payload[0],
                    );
                    state.items.splice(deletePageIndex, 1);
                }
            },
        );

        builder.addCase(
            createSection.fulfilled,
            (state, action: PayloadAction<unknown>) => {
                state.status = 'success';

                const createdSection = action.payload;

                const pageIdx = state.items.findIndex(
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    (p) => p.id === createdSection.section.pageId,
                );

                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                state.items[pageIdx].sections.push(createdSection.section);
            },
        );

        builder.addCase(
            updateSections.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.status = 'success';

                const updatedSection = action.payload[0];

                if (updatedSection) {
                    const pageIndex = getIndexById(
                        state.items,
                        updatedSection.pageId,
                    );

                    const sections = state.items[pageIndex].sections;

                    const updatedSectionIndex = getIndexById(
                        sections,
                        updatedSection.id,
                    );

                    sections.splice(updatedSectionIndex, 1, updatedSection);
                }
            },
        );

        builder.addCase(
            deleteSection.fulfilled,
            (state, action: PayloadAction<unknown>) => {
                state.status = 'success';

                if (Array.isArray(action.payload)) {
                    const deletedSection = action.payload[0];

                    const pageIndex = state.items.findIndex(
                        (item) => item.id === deletedSection.pageId,
                    );

                    const deletedSectionIndex = state.items[
                        pageIndex
                    ].sections.findIndex(
                        (item) => item.id === deletedSection.id,
                    );

                    state.items[pageIndex].sections = [
                        ...state.items[pageIndex].sections.slice(
                            0,
                            deletedSectionIndex,
                        ),
                        ...state.items[pageIndex].sections
                            .slice(deletedSectionIndex + 1)
                            .map((section) => ({
                                ...section,
                                sequence: section.sequence - 1,
                            })),
                    ];
                }
            },
        );

        builder.addMatcher(
            (action) => action.type.endsWith('rejected'),
            (state, action) => {
                toast.error(action.payload);
            },
        );
    },
});

const createAppAsyncThunk = createAsyncThunk.withTypes<{
    rejectValue: string;
    state: RootStore;
}>();

const getPages = createAppAsyncThunk<unknown>(
    'pages/getPages',
    async (_, { rejectWithValue }) =>
        await Axios.get<ServerResponse>('page/read.php')
            .then((res) => res.data.records)
            .catch((err: AxiosError<ServerResponse>) =>
                rejectWithValue(
                    `Произошла ошибка: ${err.message}. Не получается получить данные по страницам`,
                ),
            ),
);

const createPage = createAppAsyncThunk<unknown>(
    'pages/createPage',
    async (page, { rejectWithValue }) => {
        const toastId = toast.loading('Грузим данные...');

        return await Axios.post<ServerResponse>(
            'page/create.php',
            JSON.stringify(page),
        )
            .then((res) => {
                toast.success(res.data.message);
                return res.data.records;
            })
            .catch((err: AxiosError<ServerResponse>) =>
                rejectWithValue(
                    `Произошла ошибка: ${err.message}. Не получается создать страницу`,
                ),
            )
            .finally(() => {
                toast.dismiss(toastId);
            });
    },
);

const updatePage = createAppAsyncThunk<unknown>(
    'pages/updatePage',
    async (page, { rejectWithValue }) => {
        const toastId = toast.loading('Грузим данные...');

        return await Axios.post<ServerResponse>('page/update.php', page)
            .then((res) => {
                toast.success(res.data.message);
                return res.data.records;
            })
            .catch((err: AxiosError<ServerResponse>) =>
                rejectWithValue(
                    `Произошла ошибка: ${err.message}. Не получается обновить страницу`,
                ),
            )
            .finally(() => {
                toast.dismiss(toastId);
            });
    },
);

const deletePage = createAppAsyncThunk<unknown>(
    'pages/deletePage',
    async (pageId, { rejectWithValue }) => {
        const toastId = toast.loading('Грузим данные...');

        return await Axios.post<ServerResponse>('page/delete.php', {
            id: pageId,
        })
            .then((res) => {
                toast.success(res.data.message);
                return res.data.records;
            })
            .catch((err: AxiosError<ServerResponse>) =>
                rejectWithValue(
                    `Произошла ошибка: ${err.message}. Не получается удалить страницу`,
                ),
            )
            .finally(() => {
                toast.dismiss(toastId);
            });
    },
);

const createSection = createAppAsyncThunk<
    unknown,
    { section: Section; images: File[] }
>(
    'sections/createSection',
    async ({ section, images }, { rejectWithValue }) => {
        const toastId = toast.loading('Грузим данные...');
        const formData = new FormData();

        formData.append('section', JSON.stringify(section));
        images.forEach((image) => formData.append('images[]', image));

        return await Axios.post<ServerResponse>(
            'section/create.php',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            },
        )
            .then((res) => {
                toast.success(res.data.message);
                return res.data.records;
            })
            .catch((err: AxiosError<ServerResponse>) =>
                rejectWithValue(
                    `Произошла ошибка: ${err.message}. Не получается создать секцию`,
                ),
            )
            .finally(() => {
                toast.dismiss(toastId);
            });
    },
);

const updateSections = createAppAsyncThunk<
    unknown,
    { sections: Section[]; images?: Image[] }
>(
    'sections/updateSections',
    async ({ sections, images }, { rejectWithValue }) => {
        const toastId = toast.loading('Грузим данные...');
        const form = new FormData();

        form.append('sections', JSON.stringify(sections));

        if (images) {
            const newImages = images.filter((image) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                return image.arrayBuffer !== undefined;
            });

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            newImages.forEach((image) => form.append('newImages[]', image));

            const idsOldImages = images
                .filter((image) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    return image.arrayBuffer === undefined;
                })
                .map((el) => el.id);

            form.append('idsOldImages', JSON.stringify(idsOldImages));
        }

        return await Axios.post<ServerResponse>('section/update.php', form, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((res) => {
                toast.success(res.data.message);
                return res.data.records;
            })
            .catch((err: AxiosError<ServerResponse>) =>
                rejectWithValue(
                    `Произошла ошибка: ${err.message}. Не получается обновить секцию`,
                ),
            )
            .finally(() => {
                toast.dismiss(toastId);
            });
    },
);

const deleteSection = createAppAsyncThunk<unknown>(
    'sections/deleteSection',
    async (section, { rejectWithValue }) => {
        const toastId = toast.loading('Грузим данные...');

        return await Axios.post<ServerResponse>(
            'section/delete.php',
            JSON.stringify(section),
        )
            .then((res) => {
                toast.success(res.data.message);
                return res.data.records;
            })
            .catch((err: AxiosError<ServerResponse>) =>
                rejectWithValue(
                    `Произошла ошибка: ${err.message}. Не получается удалить секцию`,
                ),
            )
            .finally(() => {
                toast.dismiss(toastId);
            });
    },
);

export const pageAsyncActions = {
    getPages,
    createPage,
    deletePage,
    updatePage,
    createSection,
    updateSections,
    deleteSection,
};

export const { reducer: pageReducer, actions: pageActions } = pageSlice;
