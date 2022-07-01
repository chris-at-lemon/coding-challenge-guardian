// Shortcut to date formatting, usually moment.js or day.js would do the date formatting job
export const cleanDate = (date: string) => {
  return date.substring(0, 10)
}