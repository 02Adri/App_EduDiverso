import {Injectable} from '@angular/core'
import { Router } from '@angular/router'
import { UserService } from '../service/user.service'

@Injectable({
    providedIn:'root'
})

export class RoleGuard{
    constructor(private router:Router,private userService:UserService){}

    canActivate(): boolean {
        const role=this.userService.getRole()
        if(role==='facilitador')return true;
        //Si no es facilitador, redirigir a library y mostrar login
        this.router.navigateByUrl('/library')
        return false;
    }
}