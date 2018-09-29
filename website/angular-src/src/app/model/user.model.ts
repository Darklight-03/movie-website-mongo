import {Movie} from './movie.model';

export class User {
  public id: number;
  public username: string;
  public password: string;
  public favorites: Movie[];

  constructor (id: number, username: string, password: string) {
    this.id = id;
    this.username = username;
  }
}
