
export class PeopleModel {
    public id?: number;
    public name: string;
    public sequence: number

    constructor(peopleModelArgs: PeopleModelArgs){
        this.name = peopleModelArgs.name;
        this.sequence = peopleModelArgs.sequence;
        this.id = peopleModelArgs.id;
    }
}

export interface PeopleModelArgs {
    id?: number;
    name: string;
    sequence: number;

}