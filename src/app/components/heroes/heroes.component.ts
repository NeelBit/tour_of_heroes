import { Component, OnInit } from '@angular/core';
import { Hero } from 'src/app/hero';
/* import { HEROES } from 'src/app/mock-heroes'; */
import { HeroService } from 'src/app/services/hero.service';
import { MensajesService } from 'src/app/services/mensajes.service';

@Component({
    selector: 'app-heroes',
    templateUrl: './heroes.component.html',
    styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

    /*selectedHero: Hero;  = {
        // deshabilitado modo estricto de inicializacion
        id: 1,
        name: "Nombre1"
    }; */

    // deshabilitado modo estricto de inicializacion
    heroes: Hero[];

    constructor(private heroService: HeroService/* , private mensajeService: MensajesService */) { }

    ngOnInit(): void {
        this.getHeroes();
    }

    // asigna hero seleccionado a la propiedad selectedHero
    /* onSelect(hero: Hero): void {
        this.selectedHero = hero;
        this.mensajeService.add(`HeroesComponent: Selected hero id=${hero.id}`);
    } */

    getHeroes(): void {
        this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes);
    }

    add(name: string): void {
        name = name.trim().replace(/^./, name[0].toUpperCase()); // trim quita espacios en blanco al inicio y final, replace para poner mayuscula primer letra
        if (!name) { return; }
        this.heroService.addHero({ name } as Hero)
            .subscribe(hero => {
                this.heroes.push(hero);
            });
    }

    delete(hero: Hero): void {
        this.heroes = this.heroes.filter(h => h !== hero);
        /* Como regla general, un "Observable" no hace nada hasta que algo se suscribe. */
        this.heroService.deleteHero(hero).subscribe();
    }

}
