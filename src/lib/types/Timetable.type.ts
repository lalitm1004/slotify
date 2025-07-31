import { z } from "zod";
import { CourseEntrySchema } from "./CourseEntry.type";


export const TimetableSchema = z.object({
    id: z.string(),
    courses: z.array(CourseEntrySchema),
    created_at: z.string().refine(
        (val) => !isNaN(Date.parse(val)),
        { message: "invalid ISO datetime format" }
    )
});

export type Timetable = z.infer<typeof TimetableSchema>