// take date from '2023-08-14T05:09:20.424Z'
// return to 'AUGUST 3, 2022'

import { format } from "date-fns";

export const formatDate = (date: string) => {
  return format(new Date(date), "MMMM d, yyyy");
};
