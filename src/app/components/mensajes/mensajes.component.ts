import { Component, OnInit } from '@angular/core';
import { MensajesService } from 'src/app/services/mensajes.service';

@Component({
    selector: 'app-mensajes',
    templateUrl: './mensajes.component.html',
    styleUrls: ['./mensajes.component.css']
})
export class MensajesComponent implements OnInit {

    // debe ser publico porque la vinculara en la plantilla. Angular solo se une a las propiedades publicas del componente.
    constructor(public mensajeService: MensajesService) { }

    ngOnInit(): void {
    }

}
