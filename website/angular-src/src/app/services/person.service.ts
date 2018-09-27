import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})


export class PersonService {
  constructor(private http: HttpClient) { }

  private apiUrl = '/dbservice';


  public getPerson( id: number ) {
    const URL = `${this.apiUrl}/person?id=${id}`;
    return this.http.get(URL);
  }


  public getPopularPeople() {
    const URL = `${this.apiUrl}/popularpeople`;
    return this.http.get(URL);
  }

}
