import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Hero } from 'src/app/hero';
import { HeroService} from 'src/app/services/hero.service';

@Component({
    selector: 'app-hero-detail',
    templateUrl: './hero-detail.component.html',
    styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

    /* @Input() hero: Hero = {
        id: 2,
        name: "segundoNombre"
    }; */
    //@Input() hero: Hero | undefined;
    hero: Hero | undefined;

    

    /* El ActivatedRoute contiene información sobre la ruta a esta instancia del HeroDetailComponent.
    Este componente está interesado en los parámetros de la ruta extraídos de la URL.
    El parámetro "id" es el id del héroe que se mostrará.
    El HeroService obtiene los datos del héroe del servidor remoto y este componente lo usará para mostrar el héroe. */
    constructor(private route: ActivatedRoute, private location: Location, private heroService: HeroService) { }

    ngOnInit(): void {
        this.getHero();
    }

    getHero(): void {

        //const id = +this.route.snapshot.paramMap.get('id'); // !.valueOf

        const id = +this.route.snapshot.params['id'];
        this.heroService.getHero(id)
            .subscribe(hero => this.hero = hero);

    }

    goBack(): void {
        this.location.back();
    }

    save(): void {
        this.heroService.updateHero(this.hero!)
            .subscribe(() => this.goBack());
    }

}
