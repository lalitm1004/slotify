import { json } from "@sveltejs/kit";
import timetableJson from "$lib/server/data/time-table.json";
import { TimetableSchema } from "$lib/types/Timetable.type";
import computeSHA256Hex from "$lib/utils/computeSHA256Hex";


export const GET = async () => {
    console.log('[slotify] GET /api/timetable hit')

    const result = await TimetableSchema.safeParseAsync(timetableJson);

    if (!result.success) {
        console.error(`[slotify] TimetableSchema validation failed:`, result.error.message);
        return json({ message: "TimetableSchema validation failed" }, { status: 500 });
    }

    const timetable = result.data;
    const hash = await computeSHA256Hex(timetable);

    return json({ timetable, hash }, { status: 200 });
}