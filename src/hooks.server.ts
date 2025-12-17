import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

import handleVisuals from "$lib/server/middleware/handleVisuals";

export const handle: Handle = sequence(handleVisuals);