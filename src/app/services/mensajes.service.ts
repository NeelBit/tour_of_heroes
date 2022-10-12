import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MensajesService {

    mensajes: string[] = [];

    constructor() { }

    add(msg: string) {
        this.mensajes.push(msg);
    }

    clear() {
        this.mensajes = [];
    }
}
