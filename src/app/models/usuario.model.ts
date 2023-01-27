import { RouterLink } from "@angular/router";

export class Usuario {
    constructor(
        public nombre:String,
        public email:string,
        public password?:string,
        public img?:string,
        public google?:boolean,
        public role?:string,
        public uid?:string,
    ){

    }
}