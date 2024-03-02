export const createdPlaceHolder = (selected: number[]): string => {
    return selected.map(() => "?").join(", ");
};
