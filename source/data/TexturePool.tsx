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

type TexturePoolData = {
    TerrainTextures: {[key in BoardTerrain]: HTMLImageElement}
    AltTerrainTextures: {[key in BoardTerrain]: HTMLImageElement}
    DoorTextures: {
        open: HTMLImageElement,
        closed: HTMLImageElement
    }
    FogTextures: {
        center: HTMLImageElement,
        side: HTMLImageElement,
        corner: HTMLImageElement,
        tunnel: HTMLImageElement
        none: HTMLImageElement,
        single: HTMLImageElement,
    },
    StampTextures: {[key: string]: HTMLImageElement}
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
    
        const TerrainTextures = {
            [BoardTerrain.Grass]: await LoadImage(GrassTexture),
            [BoardTerrain.Dirt]: await LoadImage(DirtTexture),
            [BoardTerrain.Sand]: await LoadImage(SandTexture),
            [BoardTerrain.Scrub]: await LoadImage(ScrubTexture),
            [BoardTerrain.Stone]: await LoadImage(StoneTexture),
            [BoardTerrain.Wood]: await LoadImage(WoodTexture),
            [BoardTerrain.Wall]: await LoadImage(WallTexture),
            [BoardTerrain.Water]: await LoadImage(WaterTexture),
            [BoardTerrain.Tile]: await LoadImage(TileTexture),
            [BoardTerrain.Ice]: await LoadImage(IceTexture),
            [BoardTerrain.Lava]: await LoadImage(LavaTexture),
            [BoardTerrain.Snow]: await LoadImage(SnowTexture),
        }

        const StampTextures: {[key: string]: HTMLImageElement} = {};
        for (const path in StampTexturePaths) {
            const key = path.match(/\/(\w+)\.png$/)?.[1];
            if (key) {
                StampTextures[key] = await LoadImage(((await StampTexturePaths[path]()) as any).default as string);
            }
        }


        this._texturePool = {
            TerrainTextures,
            AltTerrainTextures: {
                ...TerrainTextures,
                [BoardTerrain.Grass]: await LoadImage(GrassAltTexture)
            },
            DoorTextures: {
                open: await LoadImage(DoorOpenTexture),
                closed: await LoadImage(DoorClosedTexture)
            },
            FogTextures: {
                center: await LoadImage(FogCenterTexture),
                side: await LoadImage(FogSideTexture),
                corner: await LoadImage(FogCornerTexture),
                tunnel: await LoadImage(FogTunnelTexture),
                none: await LoadImage(FogNoneTexture),
                single: await LoadImage(FogSingleTexture),
            },
            StampTextures
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