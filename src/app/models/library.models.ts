export type Role= 'facilitador' | 'nino'|'nina'|'invitado';
export type MediaType= 'pdf'| 'audio'| 'image'|'other'

export interface  LibraryItem{

    id:string;
    title:string;
    description?:string;
    category:string;
    uploader:string;
    date:string;
    coverBase64?:string;//data url of image
    fileBase64?:string;//data URL of file (pdf or audio or image)
    filename?:string;
    mime?:string;
    type:MediaType;
}

export interface AppUser{
    name:string;
    role:Role;
}