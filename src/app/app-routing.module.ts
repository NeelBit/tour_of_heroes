import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeroDetailComponent } from './components/hero-detail/hero-detail.component';
import { HeroesComponent } from './components/heroes/heroes.component';

const routes: Routes = [
    // navegacion predeterminada, que vaya a esa ruta cuando esta vacio
    { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    { path: 'heroes', component: HeroesComponent},
    { path: 'dashboard', component: DashboardComponent},
    { path: 'detalles/:id', component: HeroDetailComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
