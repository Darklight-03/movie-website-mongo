import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: Http) { }
  
  private apiUrl= 'http://localhost:3000/dbservice';

  public getMovie( id : number ):object {
    let URL = `${this.apiUrl}/movie?id=${id}`;
    return this.http.get(URL);
  }

  public getPerson( id : number ):object {
    let URL = `${this.apiUrl}/person?id=${id}`;
    return this.http.get(URL);
  }

  public getSearchResults( q : string ):object {
    let URL = `${this.apiUrl}/search?q=${q}`;
    return this.http.get(URL);
  }
}
