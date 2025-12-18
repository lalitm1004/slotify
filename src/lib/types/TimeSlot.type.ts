import { z } from "zod";


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

export const TimeSlotSchema = z.object({
    days: z.array(DayEnum),
    start_time: z.string().nullable(),
    end_time: z.string().nullable(),
    room: z.string().nullable(),
});
export type TimeSlot = z.infer<typeof TimeSlotSchema>;