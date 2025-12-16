import { z } from "zod";
import { TimeSlotSchema } from "$lib/types/TimeSlot.type";


export const ComponentTypeEnum = z.enum([
    "LEC",
    "TUT",
    "PRAC"
]);
export type ComponentType = z.infer<typeof ComponentTypeEnum>;

export const CourseEntrySchema = z.object({
    id: z.string(),
    course_name: z.string(),
    course_codes: z.array(z.string()),
    component: z.tuple([ComponentTypeEnum, z.number()]),
    student_groups: z.array(z.string()),
    timeslots: z.array(TimeSlotSchema),
    open_as_uwe: z.boolean(),
    section_variants: z.array(z.string()),
    related_entries: z.array(z.string()),
    clashing_entries: z.array(z.string()),
});
export type CourseEntry = z.infer<typeof CourseEntrySchema>;