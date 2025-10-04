export interface Position{r:number;c:number;}

export interface PlaceWord{
    word:string;
    positions:Position[];
    found:boolean;
}