import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environments } from '../../../environments/environments';
import { User } from '../interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {

  private baseUrl = environments.baseUrl;
  private user?: User;

  constructor(private http: HttpClient) { }

  get currentUser():User | undefined{
    if(!this.user) return undefined;
    return structuredClone(this.user); // Crea un clone, funcion de js
  }

  login(email: string, password: string): Observable<User>{

    return this.http.get<User>(`${this.baseUrl}/users/1`)
      .pipe(
        tap( resp => {
          this.user = resp;
          localStorage.setItem('token', 'eqdsaGFmbhHGCFbvcuTtt');
        }),
        catchError(erro => of())
      );
  }

  checkAuthentication():Observable<boolean> {
    if(!localStorage.getItem('token')) return of(false);

    const token = localStorage.getItem('token');

    return this.http.get<User>(`${this.baseUrl}/users/1`)
      .pipe(
        tap(user => {this.user = user; console.log('tap',!!user)}),
        map(user => !!user ), // '!!' significa doble negacion, osea devuelve un true
        catchError(err => of(false))
      );
  }

  logout(){
    this.user = undefined;
    localStorage.clear();
  }

}