
export class MoviePoster {
  public id: number;
  public title: string;
  public overview: string;
  public popularity: number;
  public posterPath: string;



  constructor(id: number, title: string, overview: string, popularity: number, posterPath: string) {
    this.id = id;
    this.title = title;
    this.overview = overview;
    this.popularity = popularity;
    this.posterPath = posterPath;

  }
}
