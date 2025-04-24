import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, GuardResult, MaybeAsync, Route, RouterStateSnapshot, UrlSegment, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})

export class PublicGuard implements CanMatch, CanActivate {

  constructor(
    private authService:AuthService,
    private router: Router
  ) { }

  private chackAuthStatus(): Observable<boolean>{
      return this.authService.checkAuthentication()
        .pipe(
          tap( isAuthenticated => console.log('isAuthenticated:', isAuthenticated) ),
          tap( isAuthenticated => {
            if( isAuthenticated ) this.router.navigateByUrl('/heroes/list')
          }),
          map(isAuthenticated => !isAuthenticated)
        )
    }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    return this.chackAuthStatus();
  }
  canMatch(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> {
    return this.chackAuthStatus();
  }

}