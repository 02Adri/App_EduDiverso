import {Injectable} from '@angular/core';

export interface LeaderboardEntry{
    name:string;
    score:number;
    date:string;
}

@Injectable({
    providedIn:'root'
})

export class LeaderboardService{

    private key='sopa_letras_leaderboard_v1';

    getAll():LeaderboardEntry[]{
        const raw=localStorage.getItem(this.key);
        return raw ? JSON.parse(raw) as LeaderboardEntry[]: [];
    }

    add(entry:LeaderboardEntry){
        const all=this.getAll();
        all.push(entry);
        all.sort((a,b)=>b.score - a.score);
        localStorage.setItem(this.key,JSON.stringify(all.slice(0,20)));
    }

    clear(){
        localStorage.removeItem(this.key);
    }
}