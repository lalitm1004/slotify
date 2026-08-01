import { json } from "@sveltejs/kit";
import timetableJson from "$lib/server/data/time-table.json";
import { TimetableSchema } from "$lib/types/Timetable.type";
import computeSHA256Hex from "$lib/utils/computeSHA256Hex";

const timetable = TimetableSchema.parse(timetableJson);
const hash = await computeSHA256Hex(timetable);

export const GET = async () => {
    return json({ timetable, hash }, {
        status: 200, headers: {
            "Cache-Control": "public, max-age=0, must-revalidate"
        }
    });
}
