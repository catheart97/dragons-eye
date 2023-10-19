import { CreatureCondition, CreatureSize, CreatureType, DamageType, Statblock, StatblockAction } from "./Statblock";
import { userData } from "./Environment";
import { Item, ItemType } from "./Item";
import { Spell } from "./Spell";
import { Note } from "./Note";

type Schema = {
    spells: Spell[],
    monsters: Statblock[]
    items: Item[],
    notes?: Note[]
}
export type DatabaseSchema = Schema;

type GM5Monster = {
    name: string,
    size: "T" | "S" | "M" | "L" | "H" | "G",
    type: string,
    alignment: string,
    ac: number | string,
    hp: string,
    speed: string,
    str: number,
    dex: number,
    con: number,
    int: number,
    wis: number,
    cha: number,
    skill?: string[] | string,
    senses?: string,
    passive: number,
    languages: string,
    cr: number,
    trait?: {
        name: string,
        text: string
    }[] | {
        name: string,
        text: string
    },
    action?: {
        name: string,
        text: string,
    }[] | {
        name: string,
        text: string,
    },
    reaction?: {
        name: string,
        text: string
    }[] | {
        name: string,
        text: string
    },
    legendary?: {
        name?: string,
        text: string
    }[] | {
        name?: string,
        text: string
    },
    vulnerable?: string,
    resist?: string,
    immune?: string,
    conditionImmune?: string,
    environment?: string,
    save?: string[] | string,
    slots?: string,
}

type GM5Spell = {
    name: string,
    level: number,
    school: string,
    time: string,
    range: string,
    components: string,
    duration: string,
    classes: string,
    text: string,
    ritual?: string,
    roll?: string
}

type GM5Item = {
    name: string,
    type: string,
    text: string,
    weight?: number,
    magic?: string,
    value?: string,
    range?: string,
    property?: string,
    dmg1?: string,
    dmg2?: string,
    dmgType?: string,
    ac?: string,
    roll? : string | string[],
    stealth?: string,
    strength?: string,

}

export type GM5CompendiumJSON = {
    compendium: {
        spell: GM5Spell[],
        monster: GM5Monster[],
        item: GM5Item[]
    }[]
}

const decodeHtmlEntity = (str: string) => {
    return str.replace(/&#(\d+);/g, function (_match, dec) {
        return String.fromCharCode(dec);
    });
};

export class Database {

    static _db: Database | null
    data: Schema

    private constructor() {
        const DB_PATH = userData() + "/" + "db.json";
        if (window.fsExtra.existsSync(DB_PATH)) {
            this.data = {
                spells: [],
                monsters: [],
                items: [],
                ...window.fsExtra.readJSONSync(DB_PATH)
            };
        } else {
            this.data = {
                spells: [],
                monsters: [],
                items: []
            }
        }
    }

    public getNotes(): Note[] {
        return this.data.notes ?? [];
    }

    public getSpells(): Spell[] {
        return this.data.spells;
    }

    public getMonsters(): Statblock[] {
        return this.data.monsters;
    }

    public updateNotes(notes: Note[]) {
        this.data.notes = notes;
        this.commit();
    }

    public updateSpells(spells: Spell[]) {
        this.data.spells = spells;
        this.processSpells();
    }

    private processSpells() {
        // sort by name
        this.data.spells.sort((a, b) => {
            if (a.name < b.name) {
                return -1
            } else if (a.name > b.name) {
                return 1
            }
            return 0
        })

        // remove duplicates
        let i = 0;
        while (i < this.data.spells.length - 1) {
            if (this.data.spells[i].name === this.data.spells[i + 1].name) {
                this.data.spells.splice(i, 1);
            } else {
                i++;
            }
        }
        this.commit();
    }

    private processMonsters() {
        // sort by name
        this.data.monsters.sort((a, b) => {
            if (a.name < b.name) {
                return -1
            } else if (a.name > b.name) {
                return 1
            }
            return 0
        })

        // remove duplicates
        let i = 0;
        while (i < this.data.monsters.length - 1) {
            if (this.data.monsters[i].name === this.data.monsters[i + 1].name) {
                this.data.monsters.splice(i, 1);
            } else {
                i++;
            }
        }
        this.commit();
    }

    private processItems() {
        // sort by name
        this.data.items.sort((a, b) => {
            if (a.name < b.name) {
                return -1
            } else if (a.name > b.name) {
                return 1
            }
            return 0
        })

        // remove duplicates
        let i = 0;
        while (i < this.data.items.length - 1) {
            if (this.data.items[i].name === this.data.items[i + 1].name) {
                this.data.items.splice(i, 1);
            } else {
                i++;
            }
        }
        this.commit();
    }

    public getItems(): Item[] {
        return this.data.items;
    }

    public updateItems(items: Item[]) {
        this.data.items = items;
        this.processItems();
    }

    public updateMonsters(monsters: Statblock[]) {
        this.data.monsters = monsters;
        this.processMonsters();
    }

    public commit() {
        const DB_PATH = userData() + "/" + "db.json";
        window.fsExtra.writeJSONSync(DB_PATH, this.data);
    }

    public exportToJSON(): Schema {
        return this.data;
    }

    public importFromJSON(json: Schema) {
        this.data = json;
        this.processSpells();
        this.processMonsters();
    }

    public import = (json: GM5CompendiumJSON) => {
        this.data.spells = [];
        this.data.monsters = [];
        let failCount = 0;
        json.compendium.forEach(compendium => {
            compendium.spell.forEach(spell => {
                const spellName = spell.name;
                const spellLevel = spell.level;
                const spellSchool = spell.school;
                const spellTime = spell.time;
                const spellRange = spell.range;
                const spellComponents = spell.components;
                const spellDuration = spell.duration;
                const spellText = spell.text;
                const spellRitual = spell.ritual ? true : false;

                const s: Spell = {
                    name: decodeHtmlEntity(spellName),
                    level: spellLevel,
                    school: spellSchool,
                    time: spellTime,
                    range: spellRange,
                    components: spellComponents,
                    duration: spellDuration,
                    description: decodeHtmlEntity(spellText),
                    ritual: spellRitual
                }
                this.data.spells.push(s);
            })


            compendium.item.forEach(item => {

                let type : ItemType;
                switch (item.type) {
                    case "W": type = ItemType.WondrousItem; break;
                    case "M": type = ItemType.MeleeWeapon; break;
                    case "R": type = ItemType.RangedWeapon; break;
                    case "LA": type = ItemType.LightArmor; break;
                    case "MA": type = ItemType.MediumArmor; break;
                    case "HA": type = ItemType.HeavyArmor; break;
                    case "P": type = ItemType.Potion; break;
                    case "RD": type = ItemType.Rod; break;
                    case "ST": type = ItemType.Staff; break;
                    case "WD": type = ItemType.Wand; break;
                    case "RG": type = ItemType.Ring; break;
                    case "SC": type = ItemType.Scroll; break;
                    default: failCount++; return;
                }

                const i: Item = {
                    name: decodeHtmlEntity(item.name),
                    type: type,
                    description: [
                        decodeHtmlEntity(item.text) + "\n",
                        item.range ? "Range: " + item.range + "\n" : "",
                        item.property ? "Property: " + item.property + "\n" : "",
                        item.dmg1 ? "Damage: " + item.dmg1 + "\n" : "",
                        item.dmg2 ? "Damage: " + item.dmg2 + "\n" : "",
                        item.dmgType ? "Damage Type: " + item.dmgType + "\n" : "",
                        item.ac ? "Armor Class: " + item.ac + "\n" : "",
                        item.stealth ? "Stealth: " + item.stealth + "\n" : "",
                        item.strength ? "Strength: " + item.strength + "\n" : "",
                    ].join(""),
                    weight: item.weight ?? 0,
                    magic: item.magic ? true : undefined,
                    value: item.value ? parseInt(item.value) : 0,
                }
                this.data.items.push(i);
            })
        })

        this.processSpells();
        this.processItems();

        json.compendium.forEach(compendium => {
            compendium.monster.forEach(monster => {
                try {
                    let size: CreatureSize;
                    switch (monster.size) {
                        case "T": size = CreatureSize.Tiny; break;
                        case "S": size = CreatureSize.Small; break;
                        case "M": size = CreatureSize.Medium; break;
                        case "L": size = CreatureSize.Large; break;
                        case "H": size = CreatureSize.Huge; break;
                        case "G": size = CreatureSize.Gargantuan; break;
                        default: return;
                    }

                    let type: CreatureType;
                    if (monster.type.includes("aberration")) {
                        type = CreatureType.Abberation;
                    } else if (monster.type.includes("beast")) {
                        type = CreatureType.Beast;
                    } else if (monster.type.includes("celestial")) {
                        type = CreatureType.Celestial;
                    } else if (monster.type.includes("construct")) {
                        type = CreatureType.Construct;
                    } else if (monster.type.includes("dragon")) {
                        type = CreatureType.Dragon;
                    } else if (monster.type.includes("elemental")) {
                        type = CreatureType.Elemental;
                    } else if (monster.type.includes("fey")) {
                        type = CreatureType.Fey;
                    } else if (monster.type.includes("fiend")) {
                        type = CreatureType.Fiend;
                    } else if (monster.type.includes("giant")) {
                        type = CreatureType.Giant;
                    } else if (monster.type.includes("humanoid")) {
                        type = CreatureType.Humanoid;
                    } else if (monster.type.includes("monstrosity")) {
                        type = CreatureType.Monstrosity;
                    } else if (monster.type.includes("ooze")) {
                        type = CreatureType.Ooze;
                    } else if (monster.type.includes("plant")) {
                        type = CreatureType.Plant;
                    } else if (monster.type.includes("undead")) {
                        type = CreatureType.Undead;
                    } else {
                        return;
                    }

                    const padRightWithZeros = (arr: number[], length: number) => {
                        while (arr.length < length) {
                            arr.push(0);
                        }
                        return arr;
                    }

                    let spells = []
                    let spellTrait : {
                        name: string,
                        text: string
                    } | null = null;
                    if (monster.trait) {
                        if (monster.trait instanceof Array) {
                            spellTrait = monster.trait.filter(v => v.name === "Spellcasting")[0] || null;
                        } else {
                            spellTrait = monster.trait.name === "Spellcasting" ? monster.trait : null;
                        }
                    }
                    if (spellTrait) {
                        const txt = spellTrait.text.toLowerCase();
                        for (const spell of this.data.spells) {
                            if (txt.includes(spell.name.toLowerCase())) {
                                spells.push(spell);
                            }
                        }
                    }

                    const statblock: Statblock = {
                        name: decodeHtmlEntity(monster.name),
                        size,
                        stats: {
                            Strength: monster.str,
                            Dexterity: monster.dex,
                            Constitution: monster.con,
                            Intelligence: monster.int,
                            Wisdom: monster.wis,
                            Charisma: monster.cha
                        },
                        armorClass: typeof monster.ac === "string" ? (
                            parseInt(monster.ac.split(" ")[0])
                        ) : monster.ac,
                        hitPoints: {
                            current: monster.hp.match(/\d+/g) ? parseInt(monster.hp.match(/\d+/g)![0]) : 0,
                            maximum: monster.hp.match(/\d+/g) ? parseInt(monster.hp.match(/\d+/g)![0]) : 0
                        },
                        speed: {
                            walk: monster.speed.match(/\d+/g) ? parseInt(monster.speed.match(/\d+/g)![0]) : 0,
                            swim: monster.speed.match(/\swim d+/g) ? parseInt(monster.speed.match(/\d+/g)![0]) : 0,
                            fly: monster.speed.match(/\sfly d+/g) ? parseInt(monster.speed.match(/\d+/g)![0]) : 0,
                            burrow: monster.speed.match(/\sburrow d+/g) ? parseInt(monster.speed.match(/\d+/g)![0]) : 0,
                            climb: monster.speed.match(/\sclimb d+/g) ? parseInt(monster.speed.match(/\d+/g)![0]) : 0,
                        },
                        skills: monster.skill ? (
                            typeof monster.skill === "string" ? (
                                monster.skill 
                            ) : (
                                monster.skill.join(", ")
                            )
                        ) : "",
                        senses: {
                            darkvision: monster.senses?.match(/darkvision \d+/g) ? parseInt(monster.senses.match(/darkvision \d+/g)![0].split(" ")[1]) : 0,
                            blindsight: monster.senses?.match(/blindsight \d+/g) ? parseInt(monster.senses.match(/blindsight \d+/g)![0].split(" ")[1]) : 0,
                            tremorsense: monster.senses?.match(/tremorsense \d+/g) ? parseInt(monster.senses.match(/tremorsense \d+/g)![0].split(" ")[1]) : 0,
                            truesight: monster.senses?.match(/truesight \d+/g) ? parseInt(monster.senses.match(/truesight \d+/g)![0].split(" ")[1]) : 0,
                        },
                        passivePerception: monster.passive,
                        languages: monster.languages,
                        damageResistances: (monster.resist?.split(", ") || []).map(v => DamageType[(v.charAt(0).toUpperCase() + v.substring(1)) as keyof typeof DamageType]),
                        damageImmunities: (monster.immune?.split(", ") || []).map(v => DamageType[(v.charAt(0).toUpperCase() + v.substring(1)) as keyof typeof DamageType]),
                        damageVulnerabilities: (monster.vulnerable?.split(", ") || []).map(v => DamageType[(v.charAt(0).toUpperCase() + v.substring(1)) as keyof typeof DamageType]),
                        conditionImmunities: (monster.conditionImmune?.split(", ") || []).map(v => CreatureCondition[(v.charAt(0).toUpperCase() + v.substring(1)) as keyof typeof CreatureCondition]),
                        actions: monster.action ? (
                            monster.action instanceof Array ? (monster.action.map(action => {
                                return {
                                    name: decodeHtmlEntity(action.name),
                                    description: decodeHtmlEntity(action.text)
                                }
                            })) : ([{
                                name: decodeHtmlEntity(monster.action.name),
                                description: decodeHtmlEntity(monster.action.text)
                            } as StatblockAction])
                        ) : (
                            []
                        ),
                        reactions: monster.reaction ? (
                            monster.reaction instanceof Array ? (monster.reaction.map(reaction => {
                                return {
                                    name: decodeHtmlEntity(reaction.name),
                                    description: decodeHtmlEntity(reaction.text)
                                }
                            })) : ([{
                                name: decodeHtmlEntity(monster.reaction.name),
                                description: decodeHtmlEntity(monster.reaction.text)
                            } as StatblockAction])
                        ) : (
                            []
                        ),
                        legendaryActions: monster.legendary ? (
                            monster.legendary instanceof Array ? (monster.legendary.map(legendary => {
                                return {
                                    name: legendary.name ? decodeHtmlEntity(legendary.name) : "Legendary Action",
                                    description: decodeHtmlEntity(legendary.text)
                                }
                            }
                            )) : ([{
                                name: monster.legendary.name ? decodeHtmlEntity(monster.legendary.name) : "Legendary Action",
                                description: decodeHtmlEntity(monster.legendary.text)
                            } as StatblockAction])
                        ) : (
                            []
                        ),
                        savingThrows: {
                            Strength: monster.save ? (
                                monster.save instanceof Array ? (monster.save.filter(v => v.includes("Strength"))[0] ? parseInt(monster.save.filter(v => v.includes("Strength"))[0].split(" ")[1]) : 0) : (
                                    monster.save.includes("Strength") ? parseInt(monster.save.split(" ")[1]) : 0
                                )
                            ) : 0,
                            Dexterity: monster.save ? (
                                monster.save instanceof Array ? (monster.save.filter(v => v.includes("Dexterity"))[0] ? parseInt(monster.save.filter(v => v.includes("Dexterity"))[0].split(" ")[1]) : 0) : (
                                    monster.save.includes("Dexterity") ? parseInt(monster.save.split(" ")[1]) : 0
                                )
                            ) : 0,
                            Constitution: monster.save ? (
                                monster.save instanceof Array ? (monster.save.filter(v => v.includes("Constitution"))[0] ? parseInt(monster.save.filter(v => v.includes("Constitution"))[0].split(" ")[1]) : 0) : (
                                    monster.save.includes("Constitution") ? parseInt(monster.save.split(" ")[1]) : 0
                                )
                            ) : 0,

                            Intelligence: monster.save ? (
                                monster.save instanceof Array ? (monster.save.filter(v => v.includes("Intelligence"))[0] ? parseInt(monster.save.filter(v => v.includes("Intelligence"))[0].split(" ")[1]) : 0) : (
                                    monster.save.includes("Intelligence") ? parseInt(monster.save.split(" ")[1]) : 0
                                )
                            ) : 0,
                            Wisdom: monster.save ? (
                                monster.save instanceof Array ? (monster.save.filter(v => v.includes("Wisdom"))[0] ? parseInt(monster.save.filter(v => v.includes("Wisdom"))[0].split(" ")[1]) : 0) : (
                                    monster.save.includes("Wisdom") ? parseInt(monster.save.split(" ")[1]) : 0
                                )
                            ) : 0
                            ,
                            Charisma: monster.save ? (
                                monster.save instanceof Array ? (monster.save.filter(v => v.includes("Charisma"))[0] ? parseInt(monster.save.filter(v => v.includes("Charisma"))[0].split(" ")[1]) : 0) : (
                                    monster.save.includes("Charisma") ? parseInt(monster.save.split(" ")[1]) : 0
                                )
                            ) : 0,
                        },
                        spellSlots: padRightWithZeros((monster.slots ? monster.slots.split(", ").map(v => parseInt(v)) : []), 10) as [number, number, number, number, number, number, number, number, number, number],
                        description: "",
                        traits: monster.trait ? (
                            monster.trait instanceof Array ? (monster.trait.map(trait => {
                                return {
                                    name: decodeHtmlEntity(trait.name),
                                    description: decodeHtmlEntity(trait.text)
                                }
                            })) : ([{
                                name: decodeHtmlEntity(monster.trait.name),
                                description: decodeHtmlEntity(monster.trait.text)
                            } as StatblockAction])
                        ) : [],
                        spells,
                        challengeRating: monster.cr,
                        alignment: monster.alignment,
                        type: type,
                        image: "",
                    }
                    this.data.monsters.push(statblock);
                } catch (e) {
                    failCount++;
                    console.log(e, monster)
                }
            })
        })

        console.log("Imported " + this.data.spells.length + " spells and " + this.data.monsters.length + " monsters. Failed " + failCount + " monsters.");
        this.processMonsters();
    }

    static async setup() {
        Database._db = new Database();
    }

    static getInstance() {
        if (Database._db == null) {
            Database._db = new Database();
        }
        return Database._db;
    }
}