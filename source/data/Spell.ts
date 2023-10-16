export type Spell = {
    name: string;
    level: number;
    school: string;
    components: string;
    range: string;
    time: string; // such as 1 action or 1 bonus action
    duration: string; // how long the spell lasts (+ concentration)
    description: string;
    ritual: boolean;
}