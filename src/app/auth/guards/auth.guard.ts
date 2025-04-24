import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, GuardResult, MaybeAsync, Route, RouterStateSnapshot, UrlSegment, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({providedIn: 'root'})

export class AuthGuard implements CanMatch, CanActivate{

  constructor(
    private authService:AuthService,
    private router:Router,
  ) { }

  private chackAuthStatus(): Observable<boolean>{
    return this.authService.checkAuthentication()
      .pipe(
        tap( isAuthenticated => console.log('isAuthenticated auth:', isAuthenticated) ),
        tap( isAuthenticated => {
          if( !isAuthenticated ) this.router.navigateByUrl('/auth/login')
        }),
      )
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    /* console.log('canActivate');
    console.log({ route, state});
    return true; */

    return this.chackAuthStatus();
  }

  canMatch(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> {

    /* console.log('canMatch');
    console.log({route, segments})
    return true; */

    return this.chackAuthStatus();
  }

}