import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {debounceTime, map} from 'rxjs/operators';
import {User} from '../model/user.model';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {IMovieResponse, Movie} from '../model/movie.model';

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

        return user;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }


  // movies
  public getMovie( id: number ) {
    const URL = `${this.apiUrl}/movie?id=${id}`;
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
  public getSearchResults( q: string ) {
    const URL = `${this.apiUrl}/search?q=${q}`;
    return this.http.get(URL);
  }


  // person
  public getPerson( id: number ) {
    const URL = `${this.apiUrl}/person?id=${id}`;
    return this.http.get(URL);
  }


  public getPopularPeople() {
    const URL = `${this.apiUrl}/popularpeople`;
    return this.http.get(URL);
  }


  // user
  getById(id: number) {
    return this.http.get(`${this.apiUrl}/users/` + id);
  }

  register(user: User) {
    return this.http.post(`${this.apiUrl}/users/register`, user);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/users/` + id);
  }

  /*
  public autoComplete(q: string) {
    const URL = `${this.apiUrl}/autocomplete?q=${q}`;
    return this.http.get(URL);
  }
  */
/*
  autoComplete(query: string): Observable<IMovieResponse> {
    const url = `${this.apiUrl}/autocomplete`;
    return this.http
      .get<IMovieResponse>(url, {
        observe: 'response',
        params: {
          q: query
        }
      })
      .pipe(
        map(res => {
          return res.body;
        })
      );
  }
*/

search(q: string) {
  const URL = `${this.apiUrl}/autocomplete?q=${q}`;
  const options = this.http.get(URL)
    .pipe(
      debounceTime(400),
      map(
        (data: any) => {
          return (
            data.length !== 0 ? data as any[] : [{'result': 'no matching result'}  as any]
          );
        }
      )
    )
  return options;
}

}
