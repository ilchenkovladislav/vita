interface ObjectWithId {
    id: number;
    [key: string]: any;
}

export const getIndexById = (arr: ObjectWithId[], id: number) => {
    return arr.findIndex((el) => el.id === id);
};

export const createSection = (
    title: string,
    pageId: number,
    sequence: number,
) => {
    return {
        title,
        pageId,
        comment: `<p><strong style="font-size: 42px;">${title}</strong></p>`,
        sequence,
    };
};
