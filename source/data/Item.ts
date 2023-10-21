export enum ItemType {
    WondrousItem = "W",
    MeleeWeapon = "M",
    RangedWeapon = "R",
    LightArmor = "LA",
    HeavyArmor = "HA",
    MediumArmor = "MA",
    Potion = "P",
    Rod = "RD",
    Staff = "ST",
    Wand = "WD",
    Ring = "RG",
    Scroll = "SC",
}

export type Item = {
    name: string;
    type: ItemType;
    description: string;
    value?: number;
    weight?: number;
    magic?: boolean;
    image?: string;
}