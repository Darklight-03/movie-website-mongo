import {Movie} from './movie.model';

export class Crew {
  public id: number;
  public  movie: Movie;
  public department: string;



  constructor(id: number, movie: Movie, department: string) {
    this.id = id;
    this.movie = movie;

    this.department = department;

  }
}
