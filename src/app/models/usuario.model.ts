import { environment } from "src/environments/environment";

const base_url = environment.base_url;
export class Usuario {
    constructor(
        public nombre:String,
        public email:string,
        public password?:string,
        public img?:string,
        public google?:boolean,
        public role?: 'ADMIN_ROLE' | 'USER_ROLE',
        public uid?:string,
    ){}
    get ImageUrl(){
        if(this.img){
            if (this.img.includes('https')){ return this.img; } 
            return `${base_url}/uploads/usuarios/${this.img}`;
        }
        return `${base_url}/uploads/usuarios/no-img`;
    }
}