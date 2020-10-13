export function isNone(x: any): boolean {
    return undefined === x || null === x;
}

export function isBoolean(x: any): boolean {
    return true === x || false === x;
}