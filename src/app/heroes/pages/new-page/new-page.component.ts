import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  standalone: false,
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

  public heroForms= new FormGroup({
    id:               new FormControl(''),
    superhero:        new FormControl('', { nonNullable:true }), // no puede ser null
    publisher:        new FormControl<Publisher>( Publisher.DCComics ),
    alter_ego:        new FormControl(''),
    first_appearance: new FormControl(''),
    characters:       new FormControl(''),
    alt_img:         new FormControl(''),
  });

  public publishers = [
    {id: 'DC Comics', desc: 'DC - Comics'},
    {id: 'Marvel Comics', desc: 'Marvel - Comics'},
  ]

  constructor(
    private heroServices: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ){}


  get currentHero(): Hero{
    const hero = this.heroForms.value as Hero;
    return hero;
  }

  ngOnInit(): void {
    if(!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(
        switchMap( ({id}) => this.heroServices.getHeroByid(id)),
      ).subscribe(hero => {

        if(!hero) return this.router.navigateByUrl('/');

        this.heroForms.reset(hero); // reset deja los valores en los input
        return;
      });
    //throw new Error('Method not implemented.');
  }

  onSubmit(): void{

    if(this.heroForms.invalid) return;

    if(this.currentHero.id){
      this.heroServices.updateHero(this.currentHero)
        .subscribe(hero => {
          this.showSnackbar(`${hero.superhero} Update!`);
        });

      return;
    }

    this.heroServices.addHero(this.currentHero)
      .subscribe(hero => {
        // TODO Mostar snackbar, y navegar a /heroes/edit
        this.router.navigate(['/heroes/edit', hero.id]);
        this.showSnackbar(`${hero.superhero} Created!`);
      });


    /* console.log({
      formIsValid: this.heroForms.valid,
      value: this.heroForms.value
    }); */
  }

  onDeleteHero(){
    if(!this.currentHero.id) throw Error('Hero id is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForms.value
    });

    dialogRef.afterClosed()
      .pipe(
        filter( (result:boolean) => result === true ), // pasa si solo el valor es true
        tap( result => console.log(result)),
        switchMap(() => this.heroServices.deleteByIdHero(this.currentHero.id)),
        tap(wasDeleted => console.log({wasDeleted})),
        filter( (wasDeleted:boolean) => wasDeleted ), // si se elimina pasa

      )
      .subscribe(result => {
        console.log(`Dialog result: ${result}`);
        this.router.navigateByUrl('/heroes/list');
    })


   /*  dialogRef.afterClosed().subscribe(result => {
      if(!result) return;

      this.heroServices.deleteByIdHero(this.currentHero.id)
        .subscribe(wasDeleted => {
          if(wasDeleted){
            this.router.navigateByUrl('/heroes/list');
          }
        })

      console.log(`Dialog result: ${result}`);
    }); */
  }

  showSnackbar(message: string):void{
    this.snackbar.open(message, 'done', {
      duration: 2500,
    });
  }
}
