import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Hero } from 'src/app/hero';
import { HeroService } from 'src/app/services/hero.service'; 

@Component({
    selector: 'app-hero-search',
    templateUrl: './hero-search.component.html',
    styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

    heroes$: Observable<Hero[]>;
    /* Un Subject es tanto una fuente de valores observables como un Observable en sí mismo.
    Puede suscribirse a un Subject como lo haría con cualquier Observable. 
    También puede insertar valores en ese Observable llamando a su método next(value) como lo hace el método search().*/
    private searchTerms = new Subject<string>();

    constructor(private heroService: HeroService) {}

    /* Cada vez que el usuario escribe en el cuadro de texto, el enlace llama a search() con el valor del cuadro de texto,
    un 'término de búsqueda'. 
    Los términos de búsqueda se convierten en un Observable que emite un flujo constante de términos de búsqueda */
    // Push a search term into the observable stream.
    search(term: string): void {
        /* La propiedad searchTerms es un Subject de RxJS. */
        this.searchTerms.next(term);
    }

    ngOnInit(): void {
        /* Pasar un nuevo término de búsqueda directamente a searchHeroes() después de cada pulsación de tecla del usuario 
        crearía una cantidad excesiva de solicitudes HTTP, gravando los recursos del servidor y quemando a través de planes de datos.
        En cambio, el método ngOnInit() filtra los searchTerms observables a través de una secuencia de
        operadores RxJS que reducen el número de llamadas searchHeroes(), en última instancia, 
        devuelve un observable de resultados de búsqueda de héroes oportunos (cada uno un Héroe[]). */

        /* 
        debounceTime(300) espera hasta que el flujo de nuevos eventos de cadena se detenga durante 300ms antes de pasar por la última cuerda. 
        Nunca hará solicitudes con más frecuencia que 300 ms.

        distinctUntilChanged() asegura que una solicitud se envíe solo si el texto del filtro cambió.

        switchMap() llama al servicio de búsqueda para cada término de búsqueda que pasa por debounce() y distinctUntilChanged(). 
        Cancela y descarta los observables de búsqueda anteriores, devolviendo solo el último servicio de búsqueda observable.
        */
        this.heroes$ = this.searchTerms.pipe(
            // wait 300ms after each keystroke before considering the term
            debounceTime(300),

            // ignore new term if same as previous term
            distinctUntilChanged(),

            // switch to new search observable each time the term changes
            switchMap((term: string) => this.heroService.searchHeroes(term)),
        );
    }

}
