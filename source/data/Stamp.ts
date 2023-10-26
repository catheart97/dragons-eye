export type Stamp = {
    position: {
        x: number
        y: number
    }
    width: number  // in px
    height: number // in px
    /**
     * Either the identifier in the Texture Pool or a base64 encoded image
     */
    image: string
}