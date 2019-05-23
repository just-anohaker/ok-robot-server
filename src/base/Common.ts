export type MaybeUndefined<T> = T | undefined;

export type IndexedMap = {
    [index: number]: any;
};

export type MarkedMap = {
    [mark: string]: any;
}

export type GenericType = IndexedMap | MarkedMap | number | boolean | string | undefined;

