import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})

export class Ws2Service {
socket:any;


readonly url:string = "127.0.0.1:1234";
  constructor() { 
    this.socket = io(this.url);
  }

 listenn(ev:string){
return new Observable((subscriber)=>{
  this.socket.on(ev,(data:any)=>{
    subscriber.next(data);
  })
})
 }
 sendd(ev:string, data:any){
   this.socket.emit(ev,data);
  };
 

}
