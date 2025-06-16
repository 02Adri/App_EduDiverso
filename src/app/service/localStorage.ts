import {Injectable} from '@angular/core';
import {Preferences} from '@capacitor/preferences';
import {Filesystem,Directory,Encoding} from '@capacitor/filesystem'
import {Share} from '@capacitor/share';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})

export class LocalStorageService{
    private jugadores:Record<string,number>={}//se obtiene nombre o nivel
    private readonly STORAGE_KEY='jugadores'

    constructor(){
        this.cargarJugadores()
    }

    //cargamos los jugadores al  iniciar
    async cargarJugadores(){
        const result= await Preferences.get({key:this.STORAGE_KEY})
        if(result.value){
            this.jugadores=JSON.parse(result.value)
        }
    }
    //guardar los jugadores en local
    async guardarJugador(nombre:string,nivel:number){
        await this.cargarJugadores()
        this.jugadores[nombre]=nivel;
        await Preferences.set({
            key:this.STORAGE_KEY,
            value:JSON.stringify(this.jugadores)
        })
    }

    //Obtener el nivel por nombre
    async obtenerNivel(nombre:string):Promise<number>{
        await this.cargarJugadores()
        return this.jugadores[nombre] || 1; //retorna 1 si no existe el jugador
    }

    //Obtener todos los jugadores
    async obtenerJugadores():Promise<Record<string,number>>{
        await this.cargarJugadores()
        return this.jugadores;
    }

    //Exportar un solo jugador como JSON y compartir
     async exportarUno(nombre:string):Promise<void>{
        await this.cargarJugadores();
        if(!this.jugadores[nombre]){
            await Swal.fire({
                title:'Error',
                text:'Jugador no encontrado',
                icon:'error',
                confirmButtonText:'Aceptar',
                scrollbarPadding:false,
                heightAuto:false,
                customClass:{
                    popup:'custom-alert'
                },
                backdrop:true
            })
            return;
        }
        const jugadorData={[nombre]:this.jugadores[nombre]}
        const json=JSON.stringify(jugadorData)
        const fileName=`jugador_${nombre}.json`

        try {
            await Filesystem.writeFile({
                path:fileName,
                data:json,
                directory:Directory.Documents,
                encoding:Encoding.UTF8
            })

            const uri=await Filesystem.getUri({
                path:fileName,
                directory:Directory.Documents
            })
            await Share.share({
                title:`Exportar Datos de ${nombre}`,
                text:`Datos del jugador ${nombre}`,
                url:uri.uri,
                dialogTitle:'Compartir por Bluetooth o app Disponible'
            })
        } catch (error) {
           await Swal.fire({
                title:'Error',
                text:'Jugador no encontrado',
                icon:'error',
                confirmButtonText:'Aceptar',
                scrollbarPadding:false,
                heightAuto:false,
                customClass:{
                    popup:'custom-alert'
                },
                backdrop:true
            })
            console.error('Error al escribir el archivo:', error);
        }
     }


     //importar jugadores desde archivo JSON
     async importarJugadoresDesdeArchivo(jsonContent:string){
        try {
            const nuevosJugadores= JSON.parse(jsonContent)
            await this.cargarJugadores()

            for(const nombre in nuevosJugadores){
                this.jugadores[nombre]=nuevosJugadores[nombre]
            }

            await Preferences.set({
                key:this.STORAGE_KEY,
                value:JSON.stringify(this.jugadores)
            })
            await Swal.fire({
                text:'¡Éxito!',
                title:'Datos importados correctamente',
                icon:'success',
                confirmButtonText:'Aceptar',
                scrollbarPadding:false,
                heightAuto:false,
                customClass:{
                    popup:'custom-alert'
                },
                backdrop:true
            })
        } catch (error) {
             console.error('Error al importar archivo', error);
             await Swal.fire({
                title:'Error',
                text:'Archivos inválidos o dañado',
                icon:'error',
                confirmButtonText:'Aceptar',
                scrollbarPadding:false,
                heightAuto:false,
                customClass:{
                    popup:'custom-alert'
                },
                backdrop:true
            })
        }

     }
}