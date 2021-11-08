import { Component, OnInit } from '@angular/core';
import { WsService } from 'src/app/services/ws.service';
import { NgForm } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';

import { Router } from '@angular/router';
import { getLocaleMonthNames } from '@angular/common';
@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {

error = false;
dateDuJour =  new Date();
mm= (this.dateDuJour.getMonth())+1;
jj = this.dateDuJour.getDate();
aa = this.dateDuJour.getFullYear();
hh = this.dateDuJour.getHours();
mn= this.dateDuJour.getMinutes();

saisie: any = {
    pseudo: "",
    mdp: "",
    date: this.jj+'/'+this.mm+'/'+this.aa+', à '+this.hh+'h'+this.mn

  }
  src= "./../../../assets/maison4.png";
////////////////////////////////////////////////////////////
  constructor(
    private wsService: WsService,
    private authService: AuthService,
    private router: Router
    
  ) { }
////////////////////////  ON ECOUTE  ////////////////////////////////////
  ngOnInit(): void {
    this.wsService.listen("errorConnexF").subscribe((d) => {
      this.error = true;
    });
    this.wsService.listen("okConnexF").subscribe((d: any) => {
      this.error = false;
      this.authService.utilisateur.pseudo = d.pseudo;
      this.authService.utilisateur.niveau = d.niveau;
      this.authService.logoDeconnexionVisible = true;
      this.authService.co();
      this.router.navigate(['/profil']);
    });
  }
///////////////////////////  ON ENVOIE  ////////////////////////////////////
validerSaisie(form: NgForm) {
    if (form.valid) {
      this.wsService.send("connexF", this.saisie); 
    }
    else{
      console.log('formulaire invalide');
    }
  }
  //---------------------------

}
