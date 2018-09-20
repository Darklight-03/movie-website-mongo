export class Person {
  public id: number;
  public name: string;
  public gender: number;
  public imagePath: string;
  public biograpy: string;


  constructor(id: number, name: string, gender: number, imagePath: string, biograpy: string) {
    this.id = id;
    this.name = name;
    this.gender = gender;
    this.imagePath = imagePath;
    this.biograpy = biograpy;
  }
}
