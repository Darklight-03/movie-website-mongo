import {Movie} from './movie.model';

export class User {
  id: number;
  username: string;
  password: string;
  favorites: Movie[];
}
