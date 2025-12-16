export const StringCodec = {
    encode: (s: string): string => s,
    decode: (s: string): string => s,
}

export const JSONCodec = {
    encode: JSON.stringify,
    decode: JSON.parse
}
