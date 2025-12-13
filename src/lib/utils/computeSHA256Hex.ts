const computeSHA256Hex = async (obj: Object): Promise<string> => {
    const json = JSON.stringify(obj);
    const encoder = new TextEncoder();
    const data = encoder.encode(json);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const bytes = new Uint8Array(hashBuffer);
    return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default computeSHA256Hex