import timetableJson from "$lib/server/data/time-table-minified.json";
import { TimetableSchema } from "$lib/types/Timetable.type.js";
import { json } from "@sveltejs/kit";


export const GET = async () => {
    const result = await TimetableSchema.safeParseAsync(timetableJson);

    if (!result.success) {
        console.error("Timetable JSON validation failed:", result.error.message);
        return json({ message: "Timetable JSON validation failed" }, { status: 500 });
    }

    return json({ timetable: result.data }, { status: 200 });
}