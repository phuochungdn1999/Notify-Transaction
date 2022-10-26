export const isAfterNow = (date: Date) => {
  return new Date(date).valueOf() > new Date().valueOf();
}
