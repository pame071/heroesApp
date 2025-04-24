import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'app-hero-page',
  standalone: false,
  templateUrl: './hero-page.component.html',
  styles: ``
})
export class HeroPageComponent implements OnInit {

  public hero?: Hero;

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute, // sirve para acceder a información sobre la ruta actual que está activa en tu aplicación
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.heroesService.getHeroByid(id)), // permite parar los paramat y destricturar los params
      ).subscribe(hero => {

        if(!hero) return this.router.navigate(['/heroes/list']); // si es es undefined devuelve a heroes/list

        this.hero = hero;
        console.log({hero});
        return;
      });
  }

  goBack():void{
    this.router.navigateByUrl('heroes/lits');
  }
}
