import { Injectable } from '@angular/core';
import { WsService } from './ws.service';

@Injectable({
  providedIn: 'root'
})
export class AdresseMailService {

  constructor(
    private wsService: WsService
  ) { }

  adresseEmail:any;
trouverAdresseMail(membre:any){
 this.wsService.send("trouverAdresseMail", membre);
this.wsService.listen("trouverAdresseMailS").subscribe(adresse =>{
 this.adresseEmail = adresse;
 });
 
}
}