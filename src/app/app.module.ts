import { NgModule } from '@angular/core';
// ngModel
import { FormsModule } from '@angular/forms';
// httpClient
import { HttpClientModule} from '@angular/common/http';

import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeroesComponent } from './components/heroes/heroes.component';
import { HeroDetailComponent } from './components/hero-detail/hero-detail.component';
import { HeroService } from './services/hero.service';
import { MensajesComponent } from './components/mensajes/mensajes.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

// simular peticiones http
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { InMemoryDataService } from './services/in-memory-data.service';
import { HeroSearchComponent } from './components/hero-search/hero-search.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
    declarations: [
        AppComponent,
        HeroesComponent,
        HeroDetailComponent,
        MensajesComponent,
        DashboardComponent,
        HeroSearchComponent,
        FooterComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
        // and returns simulated server responses.
        // Remove it when a real server is ready to receive requests.        
        HttpClientInMemoryWebApiModule.forRoot(
            /* El método de configuración forRoot() toma una clase InMemoryDataService eso prepara la base de datos en memoria.
            Genere la clase src/app/in-memory-data.service.ts  */
            InMemoryDataService, { dataEncapsulation: false }
        )
    ],
    providers: [HeroService],
    bootstrap: [AppComponent]
})
export class AppModule { }
