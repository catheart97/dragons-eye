import { BoardTerrain } from "./Board";

import GrassTexture from "../../resources/textures/terrain/grass.png";
import TileTexture from  "../../resources/textures/terrain/tile.png";
import WaterTexture from "../../resources/textures/terrain/water.png";
import SandTexture from  "../../resources/textures/terrain/sand.png";
import DirtTexture from  "../../resources/textures/terrain/dirt.png";
import WoodTexture from  "../../resources/textures/terrain/wood.png";
import StoneTexture from "../../resources/textures/terrain/stone.png";
import IceTexture from   "../../resources/textures/terrain/ice.png";
import LavaTexture from  "../../resources/textures/terrain/lava.png";
import SnowTexture from  "../../resources/textures/terrain/snow.png";
import ScrubTexture from "../../resources/textures/terrain/scrub.png";
import WallTexture from  "../../resources/textures/terrain/wall.png";

import DoorOpenTexture from  "../../resources/textures/door_open.png";
import DoorClosedTexture from  "../../resources/textures/door_closed.png";

import FogCenterTexture from  "../../resources/textures/fog/center.png";
import FogSideTexture from  "../../resources/textures/fog/side.png";
import FogCornerTexture from  "../../resources/textures/fog/corner.png";
import FogTunnelTexture from  "../../resources/textures/fog/tunnel.png";
import FogNoneTexture from  "../../resources/textures/fog/none.png";
import FogSingleTexture from  "../../resources/textures/fog/single.png";

import GrassAltTexture from "../../resources/textures/terrain/grass_alt.png";

const StampTexturePaths = import.meta.glob('../../resources/textures/stamps/*.png');

type AImage = HTMLImageElement | ImageBitmap;

// T either ImageBitmap or HTMLImageElement
type TexturePoolData = {
    TerrainTextures: {[key in BoardTerrain]: AImage}
    AltTerrainTextures: {[key in BoardTerrain]: AImage}
    DoorTextures: {
        open: AImage,
        closed: AImage
    }
    FogTextures: {
        center: AImage,
        side: AImage,
        corner: AImage,
        tunnel: AImage
        none: AImage,
        single: AImage,
    },
    StampTextures: {[key: string]: AImage}
}

export function LoadImage(src: string) : Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        const image = document.createElement('img');
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
    });
    
}

export async function LoadBitmap(src: string) : Promise<ImageBitmap> {
    const response = await fetch(src);
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);
    return bitmap;
}

export class TexturePool {

    private static _instance: TexturePool;
    private _texturePoolImage: TexturePoolData | null = null;
    private _texturePoolBitmap: TexturePoolData | null = null;

    private constructor() {}

    public async constructTexturePool(bitmap?: boolean) {

        let loadFunc : (p: string) => Promise<AImage> = bitmap ? LoadBitmap : LoadImage;
        if (bitmap && this._texturePoolBitmap) {
            return this._texturePoolBitmap;
        } else if (!bitmap && this._texturePoolImage) {
            return this._texturePoolImage;
        }
    
        const TerrainTextures = {
            [BoardTerrain.Grass]: await loadFunc(GrassTexture),
            [BoardTerrain.Dirt]: await loadFunc(DirtTexture),
            [BoardTerrain.Sand]: await loadFunc(SandTexture),
            [BoardTerrain.Scrub]: await loadFunc(ScrubTexture),
            [BoardTerrain.Stone]: await loadFunc(StoneTexture),
            [BoardTerrain.Wood]: await loadFunc(WoodTexture),
            [BoardTerrain.Wall]: await loadFunc(WallTexture),
            [BoardTerrain.Water]: await loadFunc(WaterTexture),
            [BoardTerrain.Tile]: await loadFunc(TileTexture),
            [BoardTerrain.Ice]: await loadFunc(IceTexture),
            [BoardTerrain.Lava]: await loadFunc(LavaTexture),
            [BoardTerrain.Snow]: await loadFunc(SnowTexture),
            [BoardTerrain.Air]: await loadFunc(GrassTexture),
        }

        const StampTextures: {[key: string]: AImage} = {};
        for (const path in StampTexturePaths) {
            const key = path.match(/\/(\w+)\.png$/)?.[1];
            if (key) {
                StampTextures[key] = await loadFunc(((await StampTexturePaths[path]()) as any).default as string);
            }
        }


        const fogCenter = await loadFunc(FogCenterTexture);
        const pool = {
            TerrainTextures,
            AltTerrainTextures: {
                ...TerrainTextures,
                [BoardTerrain.Grass]: await loadFunc(GrassAltTexture)
            },
            DoorTextures: {
                open: await loadFunc(DoorOpenTexture),
                closed: await loadFunc(DoorClosedTexture)
            },
            FogTextures: {
                center: fogCenter,
                side: fogCenter,
                corner: fogCenter,
                tunnel: fogCenter,
                none: fogCenter,
                single: fogCenter,
            },
            StampTextures
        }

        if (bitmap) {
            this._texturePoolBitmap = pool;
        } else {
            this._texturePoolImage = pool;
        }
    
        return pool;
    }

    static getInstance() : TexturePool {
        if (!this._instance) {
            this._instance = new TexturePool();
        }
        return this._instance;
    }

    public get(bitmap?: boolean) : TexturePoolData | null {
        return bitmap ? this._texturePoolBitmap : this._texturePoolImage;
    }

}