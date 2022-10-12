import { Injectable } from '@angular/core';
import { Hero } from '../hero';
import { HEROES } from '../mock-heroes';
import { Observable, of } from 'rxjs';

import { MensajesService } from './mensajes.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// para el manejo de errores
import { catchError, map, tap } from 'rxjs/operators';



@Injectable({
    providedIn: 'root'
})
export class HeroService {

    /* Defina el heroesUrl del formulario :base/:collectionName con la dirección del recurso heroes en el servidor.
    Aquí base es el recurso al que se hacen las solicitudes,
    y collectionName es el objeto de datos de héroes en in-memory-data-service.ts */
    private heroesUrl = 'api/heroes';  // URL to web api

    /** Log a HeroService message with the MessageService */
    private log(message: string) {
        this.mensajeService.add(`HeroService: ${message}`);
    }

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };


    /* getHeroes(): Observable<Hero[]> {
        // TODO: send the message _after_ fetching the heroes
        this.mensajeService.add('HeroService: fetched heroes');
        return of(HEROES);
    } */

    /** GET heroes from the server */
    getHeroes(): Observable<Hero[]> {
        return this.httpClient.get<Hero[]>(this.heroesUrl)
            .pipe(
                /* Los métodos HeroService aprovecharán el flujo de valores observables y envíe un mensaje,
                a través del método log(), al área de mensajes en la parte inferior de la página.
                Lo harán con el operador RxJS tap(), que mira los valores observables, 
                hace algo con esos valores, y los pasa La devolución de llamada tap() no toca los valores en sí mismos. */
                tap(_ => this.log('fetched heroes')),
                /* El operador catchError() intercepta un Observable que falló.
                Pasa el error a un controlador de errores que puede hacer lo que quiera con el error.
                El siguiente método handleError() informa el error y luego devuelve un resultado inocuo para que la aplicación siga funcionando. */
                catchError(this.handleError<Hero[]>('getHeroes', []))
            );
    }


    /* getHero(id: number): Observable<Hero | undefined> {
        // TODO: send the message _after_ fetching the hero
        this.mensajeService.add(`HeroService: fetched hero id=${id}`);

        return of(HEROES.find(hero => hero.id === id));
    } */

    /** GET hero by id. Will 404 if id not found */
    /*     Hay tres diferencias significativas de getHeroes():
    getHero() construye una URL de solicitud con la identificación del héroe deseado.
    El servidor debe responder con un solo héroe en lugar de una serie de héroes.
    getHero() devuelve un Observable<Hero> ("un observable de objetos Hero") en lugar de un observable de arreglos de héroes. */
    getHero(id: number): Observable<Hero> {
        const url = `${this.heroesUrl}/${id}`;
        return this.httpClient.get<Hero>(url).pipe(
            tap(_ => this.log(`fetched hero id=${id}`)),
            catchError(this.handleError<Hero>(`getHero id=${id}`))
        );
    }

    // servicio en servicio
    constructor(private mensajeService: MensajesService, private httpClient: HttpClient) { }


    /* El siguiente handleError() será compartido por muchos métodos HeroService así que está generalizado 
    para satisfacer sus diferentes necesidades.
    En lugar de manejar el error directamente, devuelve una función de controlador de errores
    a catchError que se configuró con el nombre de la operación que falló y un valor de retorno seguro.
    Después de informar el error a la consola, el controlador construye un mensaje fácil de usar y devuelve un valor seguro
    a la aplicación para que la aplicación pueda seguir funcionando.
    Como cada método de servicio devuelve un tipo diferente de resultado 'Observable', handleError() 
    toma un parámetro de tipo para que pueda devolver el valor seguro como el tipo que la aplicación espera. */
    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
    
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead
        
            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);
        
            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }


    /** PUT: update the hero on the server */
    updateHero(hero: Hero): Observable<any> {
        /* El método HttpClient.put() toma tres parámetros:
        -la URL
        -los datos para actualizar (el héroe modificado en este caso)
        -opciones */
        return this.httpClient.put(this.heroesUrl, hero, this.httpOptions).pipe(
            tap(_ => this.log(`updated hero id=${hero.id}`)),
            catchError(this.handleError<any>('updateHero'))
        );
    }


    /* addHero() difiere de updateHero() en dos formas:
    -Llama a HttpClient.post() en lugar de a put().
    -Espera que el servidor genere una identificación para el nuevo héroe, que devuelve en el Observable<Hero> a la persona que llama. */

    /** POST: add a new hero to the server */
    addHero(hero: Hero): Observable<Hero> {
        return this.httpClient.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
            tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
            catchError(this.handleError<Hero>('addHero'))
        );
    }

    /* Tenga en cuenta los siguientes puntos clave:
    -deleteHero() llama a HttpClient.delete().
    -La URL es la URL del recurso de héroes más el "id" del héroe a eliminar.
    -No envías datos como lo hiciste con put() y post().
    -Aún envías las httpOptions. */

    /** DELETE: delete the hero from the server */
    deleteHero(hero: Hero | number): Observable<Hero> {
        const id = typeof hero === 'number' ? hero : hero.id;
        const url = `${this.heroesUrl}/${id}`;
    
        return this.httpClient.delete<Hero>(url, this.httpOptions).pipe(
            tap(_ => this.log(`deleted hero id=${id}`)),
            catchError(this.handleError<Hero>('deleteHero'))
        );
    }


    /* El método regresa inmediatamente con una matriz vacía si no hay un término de búsqueda.
    El resto se parece mucho a "getHeroes()", siendo la única diferencia significativa la URL, 
    que incluye una cadena de consulta con el término de búsqueda. */
    /* GET heroes whose name contains search term */
    searchHeroes(term: string): Observable<Hero[]> {
        if (!term.trim()) {
            // if not search term, return empty hero array.
            return of([]);
        }
        return this.httpClient.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
            tap(x => x.length ?
                this.log(`found heroes matching "${term}"`) :
                this.log(`no heroes matching "${term}"`)),
            catchError(this.handleError<Hero[]>('searchHeroes', []))
        );
    }

}
