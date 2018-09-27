import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {User} from '../model/user.model';

@Injectable()
export class UserService {
  private apiUrl = '/dbservice';

  constructor(private http: HttpClient) { }


  getById(id: number) {
    return this.http.get(`${this.apiUrl}/users/` + id);
  }

  register(user: User) {
    return this.http.post(`${this.apiUrl}/users/register`, user);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/users/` + id);
  }
}
