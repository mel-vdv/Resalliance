
import { Injectable } from '@angular/core';
import { WsService } from './ws.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private wsService: WsService,
    private router: Router
  ) {

  }
//-------------------------------------------------------------------------------------
logoDeconnexionVisible = true;
//--------------------------------
utilisateur: any = {
    
  }
//-----------------------------------------------------------------------------------------
  deco(): void {
    this.utilisateur.statut = "deconnect";
    
    this.logoDeconnexionVisible = false;
    this.wsService.send("codeco", this.utilisateur);
    this.router.navigate(['/']);
  }
  co(): void {
  
    this.utilisateur.statut = "connect";
    this.logoDeconnexionVisible = true;
    this.wsService.send("codeco", this.utilisateur);

  }
  //-----------------------------------------------------------------------------------------
  quelNiveau(): void {
    this.wsService.send('quelNiveau', this.utilisateur.pseudo);
    this.wsService.listen('quelNiveauS').subscribe((niv: any) => {
      this.utilisateur.niveau = niv;
    });
  }
  infoGenerales():void{
    this.wsService.send('infoGenerales', this.utilisateur.pseudo);
    this.wsService.listen('infoGeneralesS').subscribe(info =>{
      this.utilisateur = info;
    })
  }

}