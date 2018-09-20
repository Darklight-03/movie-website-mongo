import {Person} from '../person/person.model';

export class Movie {
  public id: number;
  public title: string;
  public posterPath: string;
  public castIDList: number[];
  public crewIDList: number[];


  constructor(id: number, title: string, gender: number, posterPath: string, castIDList: number[], crewIDList: number[]) {
    this.id = id;
    this.title = title;
    this.posterPath = posterPath;
    this.castIDList = castIDList;
    this.crewIDList = crewIDList;
  }
}
