/**
 * get the details from the call stack at the provided index
 * @param index
 * @returns
 */
export const getStackFrame = (index: number, frontTrimLength = 4): string => {
    const { stack } = new Error();
    if (!stack) throw new Error("No call stack provided");

    const frames = stack.split("\n");

    const f = frames[index];

    if (!f) throw new Error(`Index ${index} out of bounds`);

    // tab width is 4 characters, we are trimming the tab
    if (f.length <= frontTrimLength)
        throw new Error("call stack entry shorter than the trim length");
    return f.substring(frontTrimLength);
};
