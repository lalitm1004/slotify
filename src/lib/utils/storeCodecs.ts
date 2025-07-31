export const StringCodec = {
    encode: (s: string) => s,
    decode: (s: string) => s,
}

export const JSONCodec = {
    encode: JSON.stringify,
    decode: JSON.parse
}