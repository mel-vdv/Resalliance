
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { WsService } from './ws.service';

@Injectable({
  providedIn: 'root'
})
export class LienService {

  constructor(
    private wsService: WsService,
    private authService: AuthService
    
  ) { }
  
duo:any = {
personneConnect : this.authService.utilisateur.pseudo,
ami2 : ""
};
verifierLien(ami1:any,ami2:any){
  this.duo.personneConnect= ami1;
  this.duo.ami2 = ami2;
  this.wsService.send("verifierLien",this.duo);
}
}
