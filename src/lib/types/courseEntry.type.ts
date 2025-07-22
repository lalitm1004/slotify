import { z } from "zod"

export const DayEnum = z.enum([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
])

export const ComponentTypeEnum = z.enum([
    "LEC",
    "TUT",
    "PRAC"
])

export const CourseEntrySchema = z.object({
    id: z.string(),
    course_name: z.string(),
    course_code: z.string(),
    component: z.tuple([ComponentTypeEnum, z.number()]),
    major: z.string(),
    room: z.string().nullable(),
    days: z.array(DayEnum),
    start_time: z.string().nullable(),
    end_time: z.string().nullable(),
    seats: z.number(),
    faculty: z.string().nullable(),
    open_as_uwe: z.boolean(),
    ltp_hours: z.number().nullable(),
    course_type: z.string().nullable(),
    action: z.string().nullable(),
    class_notes: z.string().nullable(),
    remarks: z.string().nullable()
})

export const CourseEntryListSchema = z.array(CourseEntrySchema);


export type CourseEntry = z.infer<typeof CourseEntrySchema>;
export type ComponentType = z.infer<typeof ComponentTypeEnum>;
export type Day = z.infer<typeof DayEnum>;