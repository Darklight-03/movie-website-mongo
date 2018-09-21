import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:3000/dbservice';

  public getMovie( id: number ) {
    const URL = `${this.apiUrl}/movie?id=${id}`;
    return this.http.get(URL);
  }

  public getPerson( id: number ) {
    const URL = `${this.apiUrl}/person?id=${id}`;
    return this.http.get(URL);
  }

  public getSearchResults( q: string ) {
    const URL = `${this.apiUrl}/search?q=${q}`;
    return this.http.get(URL);
  }
}
