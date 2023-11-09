export const classNames = (classes: string[]): string => {
  console.log('this is the classnames' + classes.reduce((c, p) => c + ' ' + p));
  return classes.reduce((c, p) => c + ' ' + p);
};
