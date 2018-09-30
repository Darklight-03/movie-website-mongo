import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {User} from '../model/user.model';

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient) { }

  private apiUrl = '/dbservice';
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
   getUserById(id: number) {
     return this.http.get(`${this.apiUrl}/users?id=${id}`);
   }

   registerUser(user: User) {
     return this.http.post(`${this.apiUrl}/users/register`, user);
   }

   deleteUser(id: number) {
     return this.http.delete(`${this.apiUrl}/users?id=${id}`);
   }

   public autoComplete(q: string) {
     const URL = `${this.apiUrl}/autocomplete?q=${q}`;
     return this.http.get(URL);
   }
}
