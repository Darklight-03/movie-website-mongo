import { SearchResult } from './search-result.model';

export class SearchItem {
  public people: SearchResult[];
  public movies: SearchResult[];

  constructor(people: SearchResult[], movies: SearchResult[]){
    this.people = people;
    this.movies = movies;
  }
}
