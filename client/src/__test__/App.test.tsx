import { onDragEnd } from '../store/slices/pageSlice.ts';

describe('onDragEnd', () => {
    let initialState = {
        items: [
            {
                id: 1,
                sections: [
                    { id: 0, sequence: 0 },
                    { id: 1, sequence: 1 },
                    { id: 2, sequence: 2 },
                    { id: 3, sequence: 3 },
                ],
            },
            {
                id: 2,
                sections: [
                    { id: 4, sequence: 0 },
                    { id: 5, sequence: 1 },
                    { id: 6, sequence: 2 },
                    { id: 7, sequence: 3 },
                ],
            },
        ],
    };

    afterEach(() => {
        initialState = {
            items: [
                {
                    id: 1,
                    sections: [
                        { id: 0, sequence: 0 },
                        { id: 1, sequence: 1 },
                        { id: 2, sequence: 2 },
                        { id: 3, sequence: 3 },
                    ],
                },
                {
                    id: 2,
                    sections: [
                        { id: 4, sequence: 0 },
                        { id: 5, sequence: 1 },
                        { id: 6, sequence: 2 },
                        { id: 7, sequence: 3 },
                    ],
                },
            ],
        };
    });

    describe('одна страница', () => {
        describe('вниз', () => {
            test('на 1', () => {
                const action = {
                    payload: {
                        source: { droppableId: '1', index: 0 },
                        destination: { droppableId: '1', index: 1 },
                    },
                };

                const expectedState = {
                    items: [
                        {
                            id: 1,
                            sections: [
                                { id: 1, sequence: 0 },
                                { id: 0, sequence: 1 },
                                { id: 2, sequence: 2 },
                                { id: 3, sequence: 3 },
                            ],
                        },
                        {
                            id: 2,
                            sections: [
                                { id: 4, sequence: 0 },
                                { id: 5, sequence: 1 },
                                { id: 6, sequence: 2 },
                                { id: 7, sequence: 3 },
                            ],
                        },
                    ],
                };

                onDragEnd(initialState, action);

                expect(initialState).toEqual(expectedState);
            });

            test('на несколько', () => {
                const action = {
                    payload: {
                        source: { droppableId: '1', index: 0 },
                        destination: { droppableId: '1', index: 2 },
                    },
                };

                const expectedState = {
                    items: [
                        {
                            id: 1,
                            sections: [
                                { id: 1, sequence: 0 },
                                { id: 2, sequence: 1 },
                                { id: 0, sequence: 2 },
                                { id: 3, sequence: 3 },
                            ],
                        },
                        {
                            id: 2,
                            sections: [
                                { id: 4, sequence: 0 },
                                { id: 5, sequence: 1 },
                                { id: 6, sequence: 2 },
                                { id: 7, sequence: 3 },
                            ],
                        },
                    ],
                };

                onDragEnd(initialState, action);

                expect(initialState).toEqual(expectedState);
            });

            test('в конец', () => {
                const action = {
                    payload: {
                        source: { droppableId: '1', index: 0 },
                        destination: { droppableId: '1', index: 3 },
                    },
                };

                const expectedState = {
                    items: [
                        {
                            id: 1,
                            sections: [
                                { id: 1, sequence: 0 },
                                { id: 2, sequence: 1 },
                                { id: 3, sequence: 2 },
                                { id: 0, sequence: 3 },
                            ],
                        },
                        {
                            id: 2,
                            sections: [
                                { id: 4, sequence: 0 },
                                { id: 5, sequence: 1 },
                                { id: 6, sequence: 2 },
                                { id: 7, sequence: 3 },
                            ],
                        },
                    ],
                };

                onDragEnd(initialState, action);

                expect(initialState).toEqual(expectedState);
            });
        });

        describe('вверх', () => {
            test('на 1', () => {
                const action = {
                    payload: {
                        source: { droppableId: '1', index: 3 },
                        destination: { droppableId: '1', index: 2 },
                    },
                };

                const expectedState = {
                    items: [
                        {
                            id: 1,
                            sections: [
                                { id: 0, sequence: 0 },
                                { id: 1, sequence: 1 },
                                { id: 3, sequence: 2 },
                                { id: 2, sequence: 3 },
                            ],
                        },
                        {
                            id: 2,
                            sections: [
                                { id: 4, sequence: 0 },
                                { id: 5, sequence: 1 },
                                { id: 6, sequence: 2 },
                                { id: 7, sequence: 3 },
                            ],
                        },
                    ],
                };

                onDragEnd(initialState, action);

                expect(initialState).toEqual(expectedState);
            });

            test('на несколько', () => {
                const action = {
                    payload: {
                        source: { droppableId: '1', index: 3 },
                        destination: { droppableId: '1', index: 1 },
                    },
                };

                const expectedState = {
                    items: [
                        {
                            id: 1,
                            sections: [
                                { id: 0, sequence: 0 },
                                { id: 3, sequence: 1 },
                                { id: 1, sequence: 2 },
                                { id: 2, sequence: 3 },
                            ],
                        },
                        {
                            id: 2,
                            sections: [
                                { id: 4, sequence: 0 },
                                { id: 5, sequence: 1 },
                                { id: 6, sequence: 2 },
                                { id: 7, sequence: 3 },
                            ],
                        },
                    ],
                };

                onDragEnd(initialState, action);

                expect(initialState).toEqual(expectedState);
            });

            test('навверх', () => {
                const action = {
                    payload: {
                        source: { droppableId: '1', index: 3 },
                        destination: { droppableId: '1', index: 0 },
                    },
                };

                const expectedState = {
                    items: [
                        {
                            id: 1,
                            sections: [
                                { id: 3, sequence: 0 },
                                { id: 0, sequence: 1 },
                                { id: 1, sequence: 2 },
                                { id: 2, sequence: 3 },
                            ],
                        },
                        {
                            id: 2,
                            sections: [
                                { id: 4, sequence: 0 },
                                { id: 5, sequence: 1 },
                                { id: 6, sequence: 2 },
                                { id: 7, sequence: 3 },
                            ],
                        },
                    ],
                };

                onDragEnd(initialState, action);

                expect(initialState).toEqual(expectedState);
            });
        });
    });

    describe('разные страницы', () => {
        describe('с 0 места', () => {
            test('на 0 место', () => {
                const action = {
                    payload: {
                        source: { droppableId: '1', index: 0 },
                        destination: { droppableId: '2', index: 0 },
                    },
                };

                const expectedState = {
                    items: [
                        {
                            id: 1,
                            sections: [
                                { id: 1, sequence: 0 },
                                { id: 2, sequence: 1 },
                                { id: 3, sequence: 2 },
                            ],
                        },
                        {
                            id: 2,
                            sections: [
                                { id: 0, pageId: 2, sequence: 0 },
                                { id: 4, sequence: 1 },
                                { id: 5, sequence: 2 },
                                { id: 6, sequence: 3 },
                                { id: 7, sequence: 4 },
                            ],
                        },
                    ],
                };

                onDragEnd(initialState, action);

                expect(initialState).toEqual(expectedState);
            });

            test('на 1 место', () => {
                const action = {
                    payload: {
                        source: { droppableId: '1', index: 0 },
                        destination: { droppableId: '2', index: 1 },
                    },
                };

                const expectedState = {
                    items: [
                        {
                            id: 1,
                            sections: [
                                { id: 1, sequence: 0 },
                                { id: 2, sequence: 1 },
                                { id: 3, sequence: 2 },
                            ],
                        },
                        {
                            id: 2,
                            sections: [
                                { id: 4, sequence: 0 },
                                { id: 0, pageId: 2, sequence: 1 },
                                { id: 5, sequence: 2 },
                                { id: 6, sequence: 3 },
                                { id: 7, sequence: 4 },
                            ],
                        },
                    ],
                };

                onDragEnd(initialState, action);

                expect(initialState).toEqual(expectedState);
            });

            test('на последнее место', () => {
                const action = {
                    payload: {
                        source: { droppableId: '1', index: 0 },
                        destination: { droppableId: '2', index: 4 },
                    },
                };

                const expectedState = {
                    items: [
                        {
                            id: 1,
                            sections: [
                                { id: 1, sequence: 0 },
                                { id: 2, sequence: 1 },
                                { id: 3, sequence: 2 },
                            ],
                        },
                        {
                            id: 2,
                            sections: [
                                { id: 4, sequence: 0 },
                                { id: 5, sequence: 1 },
                                { id: 6, sequence: 2 },
                                { id: 7, sequence: 3 },
                                { id: 0, pageId: 2, sequence: 4 },
                            ],
                        },
                    ],
                };

                onDragEnd(initialState, action);

                expect(initialState).toEqual(expectedState);
            });
        });

        describe('с n места', () => {
            test('на 0 место', () => {
                const action = {
                    payload: {
                        source: { droppableId: '1', index: 2 },
                        destination: { droppableId: '2', index: 0 },
                    },
                };

                const expectedState = {
                    items: [
                        {
                            id: 1,
                            sections: [
                                { id: 0, sequence: 0 },
                                { id: 1, sequence: 1 },
                                { id: 3, sequence: 2 },
                            ],
                        },
                        {
                            id: 2,
                            sections: [
                                { id: 2, pageId: 2, sequence: 0 },
                                { id: 4, sequence: 1 },
                                { id: 5, sequence: 2 },
                                { id: 6, sequence: 3 },
                                { id: 7, sequence: 4 },
                            ],
                        },
                    ],
                };

                onDragEnd(initialState, action);

                expect(initialState).toEqual(expectedState);
            });

            test('на 1 место', () => {
                const action = {
                    payload: {
                        source: { droppableId: '1', index: 2 },
                        destination: { droppableId: '2', index: 1 },
                    },
                };

                const expectedState = {
                    items: [
                        {
                            id: 1,
                            sections: [
                                { id: 0, sequence: 0 },
                                { id: 1, sequence: 1 },
                                { id: 3, sequence: 2 },
                            ],
                        },
                        {
                            id: 2,
                            sections: [
                                { id: 4, sequence: 0 },
                                { id: 2, pageId: 2, sequence: 1 },
                                { id: 5, sequence: 2 },
                                { id: 6, sequence: 3 },
                                { id: 7, sequence: 4 },
                            ],
                        },
                    ],
                };

                onDragEnd(initialState, action);

                expect(initialState).toEqual(expectedState);
            });

            test('на последнее место', () => {
                const action = {
                    payload: {
                        source: { droppableId: '1', index: 2 },
                        destination: { droppableId: '2', index: 4 },
                    },
                };

                const expectedState = {
                    items: [
                        {
                            id: 1,
                            sections: [
                                { id: 0, sequence: 0 },
                                { id: 1, sequence: 1 },
                                { id: 3, sequence: 2 },
                            ],
                        },
                        {
                            id: 2,
                            sections: [
                                { id: 4, sequence: 0 },
                                { id: 5, sequence: 1 },
                                { id: 6, sequence: 2 },
                                { id: 7, sequence: 3 },
                                { id: 2, pageId: 2, sequence: 4 },
                            ],
                        },
                    ],
                };

                onDragEnd(initialState, action);

                expect(initialState).toEqual(expectedState);
            });
        });
    });
});
