import type { HttpCatInput } from './types';

export const isValidHttpStatusCode = (code: number): boolean => {
    return Number.isInteger(code) && code >= 100 && code <= 599;
}

export const extractStatusCode = (code: HttpCatInput): number => {
    if (typeof code === 'number') return code;

    if (code && typeof code === 'object' && 'status' in code) return code.status;

    return NaN;
}
