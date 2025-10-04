import {Injectable } from '@angular/core';

@Injectable({
    providedIn:'root'
})

export class Score2Service{
    private STORAGE_KEY='puntuaciones_juego_sapito'

    constructor(){}

    guardarPuntuacion(puntuaciones:any[]){
       
        localStorage.setItem(this.STORAGE_KEY,JSON.stringify(puntuaciones))


    }

    //Funcion para obtener puntuaciones 
    obtenerPuntuaciones():any[]{
        const data=localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data):[];
    }
    //Funcion para limpiar puntuaciones
    limpiarPuntuaciones(){
        localStorage.removeItem(this.STORAGE_KEY);
    }
}