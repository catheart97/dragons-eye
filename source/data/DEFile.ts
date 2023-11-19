import { Board, LegacyBoard_0_5_7 } from "./Board";
import { Campaign } from "./Campaign";

declare const APP_VERSION: string;

export enum DEFileType {
    BoardFile = "board",
    CampaignFile = "campaign"
}

export type DEFile = {
    version: string,
    type: DEFileType,
    data: Board | Campaign | LegacyBoard_0_5_7
}

export const makeBoardFile = (data: Board): DEFile => {
    return {
        version: APP_VERSION,
        type: DEFileType.BoardFile,
        data: data
    }
}

export const makeCampaignFile = (data: Campaign): DEFile => {
    return {
        version: APP_VERSION,
        type: DEFileType.CampaignFile,
        data: data
    }
}

class Version {
    major: number = 0;
    minor: number = 0;
    patch: number = 0;

    constructor(major: number, minor: number, patch: number) {
        this.major = major;
        this.minor = minor;
        this.patch = patch;
    }

    static fromString(str: string) {
        const parts = str.split(".");
        return new Version(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2]));
    }

    lessThanOrEqual(other: Version) {
        return this.major <= other.major && this.minor <= other.minor && this.patch <= other.patch;
    }

    toString() {
        return `${this.major}.${this.minor}.${this.patch}`;
    }
}

const V0_5_7 = Version.fromString("0.5.7");
const V0_5_8 = Version.fromString("0.5.8");

export const upgradeBoardFile = (file: DEFile): DEFile => {
    const fileVersion = Version.fromString(file.version);

    if (fileVersion.lessThanOrEqual(V0_5_7)) {
        const legacyBoard = file.data as LegacyBoard_0_5_7;

        const board : Board = {
            width: legacyBoard.width,
            height: legacyBoard.height,
            layers: [
                {
                    terrain: legacyBoard.terrain,
                    decorators: legacyBoard.decorators,
                    stamps: legacyBoard.stamps,
                    hidden: legacyBoard.hidden,
                }
            ],
            decoratorCounter: legacyBoard.decoratorCounter,
            activeLayer: 0
        }

        file = {
            version: V0_5_8.toString(),
            type: file.type,
            data: board
        }
    }

    return file;
}

export const upgradeCampaignFile = (file: DEFile): DEFile => {

    const fileVersion = Version.fromString(file.version);

    if (fileVersion.lessThanOrEqual(V0_5_7)) {
        const campaign = file.data as Campaign;

        campaign.adventures.forEach(adventure => {
            adventure.encounters.forEach(encounter => {
                if (encounter.board) {
                    const legacyBoard = encounter.board as any as LegacyBoard_0_5_7;

                    const board : Board = {
                        width: legacyBoard.width,
                        height: legacyBoard.height,
                        layers: [
                            {
                                terrain: legacyBoard.terrain,
                                decorators: legacyBoard.decorators,
                                stamps: legacyBoard.stamps,
                                hidden: legacyBoard.hidden,
                            }
                        ],
                        decoratorCounter: legacyBoard.decoratorCounter,
                        activeLayer: 0
                    }

                    encounter.board = board;
                }
            });
        });

        campaign.encounters.forEach(encounter => {
            if (encounter.board) {
                const legacyBoard = encounter.board as any as LegacyBoard_0_5_7;

                const board : Board = {
                    width: legacyBoard.width,
                    height: legacyBoard.height,
                    layers: [
                        {
                            terrain: legacyBoard.terrain,
                            decorators: legacyBoard.decorators,
                            stamps: legacyBoard.stamps,
                            hidden: legacyBoard.hidden,
                        }
                    ],
                    decoratorCounter: legacyBoard.decoratorCounter,
                    activeLayer: 0
                }

                encounter.board = board;
            }
        });

        file = {
            version: V0_5_8.toString(),
            type: file.type,
            data: campaign
        }
    }

    return file;
}