import {Injectable} from '@angular/core';

@Injectable({
    providedIn:'root'
})

export class AuthService{
   
    private STORAGE_KEY='maestros';
    private STORAGE_KEY_CHILDREN='estudiantes';

    constructor(){}

     //obtener todos los maestros almacenados
     getMaestros():any[]{
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY)|| '[]');

     }
     getChildren():any[]{
       return JSON.parse(localStorage.getItem(this.STORAGE_KEY_CHILDREN)||'[]')
     }

     //Metodo para guardar un maestro
     addMaestro(nombre:string, password:string){
        const maestros=this.getMaestros();
        maestros.push({nombre,password});
        localStorage.setItem(this.STORAGE_KEY,JSON.stringify(maestros));
     }
     addChildren(nombre:string, password:string){
      const children=this.getChildren();
        children.push({nombre,password});
        localStorage.setItem(this.STORAGE_KEY_CHILDREN,JSON.stringify(children));
     }

     //Verificamos si el maestro existe
     validarMaestro(nombre:string,password:string):boolean{
        const maestros=this.getMaestros();
        const maestro=maestros.find(m=>m.nombre===nombre && m.password===password);
        return !!maestro;
     }
     validarChildren(nombre:string,password:string):boolean{
      const children=this.getChildren();
      const child=children.find(c=>c.nombre===nombre && c.password===password);
      return !!child;
     }
}