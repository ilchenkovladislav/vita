import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { Page, StateStatus } from '../types';
import API from '../../services/API.ts';
import { getIndexById } from '../../utility/utility.ts';
import { createPage } from './pages/createPage.ts';
import { getPages } from './pages/getPages.ts';
import { updatePage } from './pages/updatePage.ts';
import { deletePage } from './pages/deletePage.ts';
import { createSection } from './sections/createSection.ts';
import { updateSections } from './sections/updateSections.ts';
import { deleteSection } from './sections/deleteSection.ts';

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
