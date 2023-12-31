import { Spell } from "./Spell";

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
    image: string;
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

export type SpeedStat = {
    walk: number;
    fly: number;
    swim: number;
    burrow: number;
    climb: number;
}

export type Statblock = PlayerStatblock & {
    armorClass: number;
    speed: SpeedStat;

    hitPoints: {
        current: number;
        maximum: number;
        temporary?: number;
    }
    
    stats: {
        [key in Stat]: number;
    }

    savingThrows: {
        [key in Stat]: number;
    }

    skills: string;

    damageVulnerabilities: DamageType[];
    damageResistances: DamageType[];
    damageImmunities: DamageType[];

    conditionImmunities: CreatureCondition[];

    senses: {
        darkvision: number;
        blindsight: number;
        tremorsense: number;
        truesight: number;
    }
    passivePerception: number;
    languages: string;
    challengeRating: number;

    actions: StatblockAction[];
    spells: Spell[];
    spellSlots: [number, number, number, number, number, number, number, number, number, number]
    legendaryActions: StatblockAction[];
    reactions: StatblockAction[];  
    traits: StatblockAction[];

    description: string;

    alignment: string;
    type: CreatureType;

}

export const constructDefaultStatblock = (): Statblock => {
    return {
        name: "New Creature",
        size: CreatureSize.Medium,
        hitPoints: {
            current: 10,
            maximum: 10,
            temporary: 0
        },
        armorClass: 10,
        speed: {
            walk: 30,
            fly: -1,
            swim: -1,
            burrow: -1,
            climb: -1
        },
        stats: {
            Strength: 10,
            Dexterity: 10,
            Constitution: 10,
            Intelligence: 10,
            Wisdom: 10,
            Charisma: 10
        },
        savingThrows: {
            Strength: 0,
            Dexterity: 0,
            Constitution: 0,
            Intelligence: 0,
            Wisdom: 0,
            Charisma: 0
        },
        skills: "",
        damageVulnerabilities: [],
        damageResistances: [],
        damageImmunities: [],
        conditionImmunities: [],
        senses: {
            darkvision: 0,
            blindsight: 0,
            tremorsense: 0,
            truesight: 0
        },
        passivePerception: 10,
        languages: "",
        challengeRating: 0,
        actions: [],
        spells: [],
        spellSlots: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        legendaryActions: [],
        reactions: [],
        traits: [],
        description: "",
        alignment: "",
        image: "",
        type: CreatureType.Humanoid,
    }
}