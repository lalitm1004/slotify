import { z } from "zod"


export const DayEnum = z.enum([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
]);

export type Day = z.infer<typeof DayEnum>;
