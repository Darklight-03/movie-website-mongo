import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  private apiUrl = '/dbservice';

  public getSearchResults( q: string ) {
    const URL = `${this.apiUrl}/search?q=${q}`;
    return this.http.get(URL);
  }

}
