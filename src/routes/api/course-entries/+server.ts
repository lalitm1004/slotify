import { json } from "@sveltejs/kit";
import { CourseEntryListSchema } from "$lib/types/courseEntry.type";
import timetableJson from "$lib/data/time-table-minified.json";

export const GET = async () => {
    console.log('endpoint hit')
    const result = CourseEntryListSchema.safeParse(timetableJson);

    if (!result.success) {
        console.error("Timetable JSON validation failed: ", result.error.message);
        return json({ message: "Timetable JSON validation failed" }, { status: 500 })
    }

    return json({ courses: result.data }, { status: 200 })
}