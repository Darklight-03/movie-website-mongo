import {Cast} from './cast.model';
import {Crew} from './crew.model';

export class Person {
  public id: number;
  public name: string;
  public gender: number;
  public imagePath: string;
  public castList: Cast[] ;
  public crewList: Crew[] ;
  public biograpy: string;



  constructor(id: number, name: string, gender: number, imagePath: string, castList: Cast[], crewList: Crew[], biograpy: string) {
    this.id = id;
    this.name = name;
    this.gender = gender;
    this.imagePath = imagePath;
    this.castList = castList;
    this.crewList = crewList;
    this.biograpy = biograpy;

  }
}
