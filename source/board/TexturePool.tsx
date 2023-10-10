import { BoardTerrain } from "./Board";

import GrassTexture from "../../resources/textures/TinyTextures/128x128/Grass/11.png";
import TileTexture from "../../resources/textures/TinyTextures/128x128/Tile/31.png";
import WaterTexture from "../../resources/textures/TinyTextures/128x128/Elements/32.png";
import SandTexture from "../../resources/textures/TinyTextures/128x128/Dirt/3.png";
import DirtTexture from "../../resources/textures/TinyTextures/128x128/Dirt/14.png";
import WoodTexture from "../../resources/textures/TinyTextures/128x128/Wood/22.png";
import StoneTexture from "../../resources/textures/TinyTextures/128x128/Stone/9.png";
import IceTexture from "../../resources/textures/TinyTextures/128x128/Elements/31.png";
import LavaTexture from "../../resources/textures/TinyTextures/128x128/Elements/14.png";
import SnowTexture from "../../resources/textures/TinyTextures/128x128/Elements/41.png";
import ScrubTexture from "../../resources/textures/TinyTextures/128x128/Grass/12.png";

type TexturePoolData = {
    TerrainTextures: {[key in BoardTerrain]: HTMLImageElement}
}

export const LoadImage = async (src: string) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
    });
}

export class TexturePool {

    private static _instance: TexturePool;
    private _texturePool: TexturePoolData | null = null;

    private constructor() {}

    public async constructTexturePool() {
        if (this._texturePool) {
            return this._texturePool;
        }
    
        this._texturePool = {
            TerrainTextures: {
                [BoardTerrain.Grass]: await LoadImage(GrassTexture),
                [BoardTerrain.Dirt]: await LoadImage(DirtTexture),
                [BoardTerrain.Sand]: await LoadImage(SandTexture),
                [BoardTerrain.Scrub]: await LoadImage(ScrubTexture),
                [BoardTerrain.Stone]: await LoadImage(StoneTexture),
                [BoardTerrain.Wood]: await LoadImage(WoodTexture),
                [BoardTerrain.Wall]: new Image(),
                [BoardTerrain.Water]: await LoadImage(WaterTexture),
                [BoardTerrain.Tile]: await LoadImage(TileTexture),
                [BoardTerrain.Ice]: await LoadImage(IceTexture),
                [BoardTerrain.Lava]: await LoadImage(LavaTexture),
                [BoardTerrain.Snow]: await LoadImage(SnowTexture),
            }
        }
    
        return this._texturePool;
    }

    static getInstance() : TexturePool {
        if (!this._instance) {
            this._instance = new TexturePool();
        }
        return this._instance;
    }

    public get() : TexturePoolData | null {
        return this._texturePool;
    }

}