/**
 * target object deep and merge target one or many objects.
 * {Target} <-- {source overwrite} <-- {sources overwrite} and return new target merge
 * @param target
 * @param ...sources overwhite
 */
export declare function defaults<T = object>(target: T, ...sources: object[]): T;
