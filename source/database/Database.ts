import { Spell, Statblock } from "../statblock/Statblock";
import { userData } from "./Environment";

type Schema = {
    spells: Spell[],
    monsters: Statblock[]
}

export class Database {

    static _db: Database | null
    data: Schema

    private constructor() {
        const DB_PATH = userData() + "/" + "db.json";
        if (window.fsExtra.existsSync(DB_PATH)){
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