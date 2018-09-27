import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})


export class MovieService {
  constructor(private http: HttpClient) { }

  private apiUrl = '/dbservice';

  public getMovie( id: number ) {
    const URL = `${this.apiUrl}/movie?id=${id}`;
    return this.http.get(URL);
  }

  public getTopGrossing() {
    const URL = `${this.apiUrl}/topgrossing`;
    return this.http.get(URL);
  }
}
