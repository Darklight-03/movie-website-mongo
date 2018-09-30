import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { User } from '../model/user.model';

export interface UserDetails {
  _id: string;
  username: string;
  exp: number;
  iat: number;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  password: string;
  username?: string;
}

@Injectable()
export class NetworkService {
  constructor(private http: HttpClient, private router: Router) { }

  private apiUrl = '/dbservice';
  private token: string;

  private saveToken(token: string): void {
    localStorage.setItem('mean-token', token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  // authentication
  login(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/users/authenticate`, { username: username, password: password })
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.saveToken(user.token);
          this.token = user.token;
          //localStorage.setItem('currentUser', JSON.stringify(user));
        }
        else {
          // login not valid
        }

        return user;
      }));
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('mean-token');
    this.router.navigateByUrl('/');
  }

  public register(user: TokenPayload) {
    return this.http.post(`${this.apiUrl}/users/register`, user);
  }

  // public login(user: TokenPayload): Observable<any> {
  //   return this.request('post', 'login', user);
  // }

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
