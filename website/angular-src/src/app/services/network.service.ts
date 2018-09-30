import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {User} from '../model/user.model';

@Injectable()
export class NetworkService {
  constructor(private http: HttpClient) { }

  private apiUrl = '/dbservice';

  // authentication
  login(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/users/authenticate`, { username: username, password: password })
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        else {
          // login not valid
        }

        return user;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }

  // movies
  public getMovie( id: number , sort: string) {
    const URL = `${this.apiUrl}/movie?id=${id}&sort=${sort}`;
    return this.http.get(URL);
  }

  public getTopGrossing() {
    const URL = `${this.apiUrl}/topgrossing`;
    return this.http.get(URL);
  }

  public getPopularMovies() {
    const URL = `${this.apiUrl}/popularmovies`;
    return this.http.get(URL);
  }


  // search
  public getSearchResults( q: string , sort: string, num: number, start: number) {
    const URL = `${this.apiUrl}/search?q=${q}&sort=${sort}&num=${num}&start=${start}`;
    return this.http.get(URL);
  }


  // person
  public getPerson( id: number , sort: string) {
    const URL = `${this.apiUrl}/person?id=${id}&sort=${sort}`;
    return this.http.get(URL);
  }


  public getPopularPeople() {
    const URL = `${this.apiUrl}/popularpeople`;
    return this.http.get(URL);
  }

   // user
  public getUserById(id: number) {
    return this.http.get(`${this.apiUrl}/users?id=${id}`);
  }

  public registerUser(user: User) {
    return this.http.post(`${this.apiUrl}/users/register`, user);
  }

  public deleteUser(id: number) {
    return this.http.delete(`${this.apiUrl}/users?id=${id}`);
  }

  public autoComplete(q: string) {
    const URL = `${this.apiUrl}/autocomplete?q=${q}`;
    return this.http.get(URL);
  }
}
