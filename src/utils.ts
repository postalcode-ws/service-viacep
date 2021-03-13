/**
 * target object deep and merge target one or many objects.
 * {Target} <-- {source overwrite} <-- {sources overwrite} and return new target merge
 * @param target
 * @param ...sources overwhite
 */
export function defaults<T = object>(target: T, ...sources: object[]): T {
  /* istanbul ignore else */
  if (target instanceof Object && Array.isArray(sources)) {
    sources.forEach((source) => {
      /* istanbul ignore else */
      if (source instanceof Object) {
        Object.keys(source).forEach((key) => {
          if (typeof source[key as keyof object] === "object") {
            Object.assign(
              target[key as keyof object],
              defaults(target[key as keyof object], source[key as keyof object])
            );
          } else {
            target[key as keyof object] = source[key as keyof object];
          }
        });
      }
    });
  }
  return target;
}
