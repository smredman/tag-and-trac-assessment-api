export const numToBool = (value: number, oneIsTrue: boolean = true): boolean => {
    if (oneIsTrue) {
        return value === 1 ? true : false;
    }
    return value === 0 ? true : false;
};

export const boolToNum = (value: boolean, oneIsTrue: boolean = true): number => {
    if (oneIsTrue) {
        return value === true ? 1 : 0;
    }
    return value === false ? 1 : 0;
}