export enum Stat {
    Strength = "Strength",
    Dexterity = "Dexterity",
    Constitution = "Constitution",
    Intelligence = "Intelligence",
    Wisdom = "Wisdom",
    Charisma = "Charisma",
}

export type PlayerStatblock = {
    name: string;
    size: CreatureSize
}

export enum DamageType {
    Bludgeoning = "Bludgeoning",
    Piercing = "Piercing",
    Slashing = "Slashing",
    Fire = "Fire",
    Cold = "Cold",
    Lightning = "Lightning",
    Thunder = "Thunder",
    Poison = "Poison",
    Acid = "Acid",
    Necrotic = "Necrotic",
    Radiant = "Radiant",
    Psychic = "Psychic",
    Force = "Force"
}

export enum CreatureType {
    Beast = "Beast",
    Celestial = "Celestial",
    Construct = "Construct",
    Dragon = "Dragon",
    Elemental = "Elemental",
    Fey = "Fey",
    Fiend = "Fiend",
    Giant = "Giant",
    Humanoid = "Humanoid",
    Abberation = "Abberation",
    Monstrosity = "Monstrosity",
    Ooze = "Ooze",
    Plant = "Plant",
    Undead = "Undead"
}

export enum CreatureSize {
    Tiny = "Tiny",
    Small = "Small",
    Medium = "Medium",
    Large = "Large",
    Huge = "Huge",
    Gargantuan = "Gargantuan"
}

export enum CreatureCondition {
    Stunned = "Stunned",
    Unconcious = "Unconcious",
    Charmed = "Charmed",
    Blinded = "Blinded",

    Exhausted1 = "Exhausted1",
    Exhausted2 = "Exhausted2",
    Exhausted3 = "Exhausted3",
    Exhausted4 = "Exhausted4",
    Exhausted5 = "Exhausted5",

    Fixed = "Fixed",
    Paralyzed = "Paralyzed",
    Grappled = "Grappled",
    Incapacitated = "Incapacitated",
    Prone = "Prone",
    Deafened = "Deafened",
    Invisible = "Invisible",
    Frightened = "Frightened",
    Poisoned = "Poisoned",
    Petrified = "Petrified",

}

export type StatblockAction = {
    name: string;
    description: string;
}

export type Spell = {
    name: string;
    level: number;
    description: string;
    school: string;
    ritual: boolean;
    concentration: boolean;
}

export type Statblock = PlayerStatblock & {
    
    armorClass?: number;
    speed?: {
        walk: number;
        fly?: number;
        swim?: number;
        burrow?: number;
        climb?: number;
    }

    hitPoints: {
        current: number;
        maximum: number;
        temporary?: number;
    }
    
    stats?: {
        [key in Stat]: number;
    }

    savingThrows?: {
        [key in Stat]: number;
    }

    skills?: {
        [key: string]: number;
    }

    damageVulnerabilities?: DamageType[];
    damageResistances?: DamageType[];
    damageImmunities?: DamageType[];

    conditionImmunities?: CreatureCondition[];

    senses?: {
        darkvision?: number;
        blindsight?: number;
        tremorsense?: number;
        truesight?: number;
    }
    passivePerception?: number;
    languages?: string[];
    challengeRating?: number;

    actions?: StatblockAction[];
    spells?: Spell[];
    spellSlots?: [number, number, number, number, number, number, number, number, number, number]
    legendaryActions?: StatblockAction[];
    reactions?: StatblockAction[];  

    description?: string;

    image?: string;

    alignment?: string;
    type?: CreatureType;

}