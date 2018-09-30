import {Movie} from './movie.model';

export class User {
  public id: number;
  public username: string;
  public hash: string;
  public salt: string;
  public favorites: Movie[];

  constructor (id: number, username: string, hash: string, salt: string) {
    this.id = id;
    this.username = username;
    this.hash = hash;
    this.salt = salt;
  }
}
