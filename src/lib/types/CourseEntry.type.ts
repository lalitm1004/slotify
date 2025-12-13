import { z } from "zod"
import { DayEnum } from "./Day.type";


export const ComponentTypeEnum = z.enum([
    "LEC",
    "TUT",
    "PRAC"
]);
export type ComponentType = z.infer<typeof ComponentTypeEnum>;

export const CourseEntrySchema = z.object({
    id: z.string(),
    course_name: z.string(),
    course_code: z.array(z.string()),
    component: z.tuple([ComponentTypeEnum, z.number()]),
    student_groups: z.array(z.string()),
    room: z.string().nullable(),
    days: z.array(DayEnum),
    start_time: z.string().nullable(),
    end_time: z.string().nullable(),
    open_as_uwe: z.boolean(),
    ltp_hours: z.number().nullable(),
    section_variants: z.array(z.string()),
    related_entries: z.array(z.string()),
});
export type CourseEntry = z.infer<typeof CourseEntrySchema>;

export const CourseEntryListSchema = z.array(CourseEntrySchema);
export type CourseEntryList = z.infer<typeof CourseEntryListSchema>;