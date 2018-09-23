import {Movie} from './movie.model';

export class Cast {
  public id: number;
  public  movie: Movie;
  public character: string;



  constructor(id: number, movie: Movie, character: string) {
    this.id = id;
    this.movie = movie;
    this.character = character;

  }
}
