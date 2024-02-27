export const classNames = (...classes: string[]): string => {
  return classes.reduce((c, p) => c + ' ' + p);
};
