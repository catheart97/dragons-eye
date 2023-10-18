import { Board } from "./Board";
import { Campaign } from "./Campaign";

declare const APP_VERSION: string;

export enum DEFileType {
    BoardFile = "board",
    CampaignFile = "campaign"
}

export type DEFile = {
    version: string,
    type: DEFileType,
    data: Board | Campaign
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