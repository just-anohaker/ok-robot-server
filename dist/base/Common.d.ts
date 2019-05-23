export declare type MaybeUndefined<T> = T | undefined;
export declare type IndexedMap = {
    [index: number]: any;
};
export declare type MarkedMap = {
    [mark: string]: any;
};
export declare type GenericType = IndexedMap | MarkedMap | number | boolean | string | undefined;
