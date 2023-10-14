import { Spell, Statblock } from "../statblock/Statblock";
import { userData } from "./Environment";
import he from "he";

type Schema = {
    spells: Spell[],
    monsters: Statblock[]
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

export type GM5CompendiumJSON = {
    compendium: {
        spell: GM5Spell[]
    }[]
}

const decodeHtmlEntity = (str: string) => {
    return str.replace(/&#(\d+);/g, function(match, dec) {
      return String.fromCharCode(dec);
    });
  };

export class Database {

    static _db: Database | null
    data: Schema

    private constructor() {
        const DB_PATH = userData() + "/" + "db.json";
        if (window.fsExtra.existsSync(DB_PATH)) {
            this.data = window.fsExtra.readJSONSync(DB_PATH);
        } else {
            this.data = {
                spells: [],
                monsters: []
            }
        }
        console.log(
            "Database",
            this.data
        )
    }

    public getSpells(): Spell[] {
        return this.data.spells;
    }

    public getMonsters(): Statblock[] {
        return this.data.monsters;
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

    public updateMonsters(monsters: Statblock[]) {
        this.data.monsters = monsters;
        this.commit();
    }

    public commit() {
        const DB_PATH = userData() + "/" + "db.json";
        window.fsExtra.writeJSONSync(DB_PATH, this.data);
    }

    public import = (json: GM5CompendiumJSON) => {
        this.data.spells = [];
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
        })

        this.processSpells();
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