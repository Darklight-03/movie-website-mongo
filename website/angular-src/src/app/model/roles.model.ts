export class Roles {
  public departments: Department[];
  public characters: Character[];

  constructor(departments: Department[], characters: Character[]){ 
    this.departments = departments;
    this.characters = characters;
  }
}

export class Character {
  public character: string;

  constructor(character: string){
    this.character = character;
  }
}

export class Department{
  public department: string;

  constructor(department: string){
    this.department = department;
  }
}
