interface ObjectWithId {
    id: number;
    [key: string]: any;
}

export const getIndexById = (arr: ObjectWithId[], id: number) => {
    return arr.findIndex((el) => el.id === id);
};
