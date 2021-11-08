import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { EditerService } from 'src/app/services/editer.service';
import { MembreClikService } from 'src/app/services/membre-clik.service';
import { WsService } from 'src/app/services/ws.service';
import { isThisTypeNode } from 'typescript';


@Component({
  selector: 'app-profilmembre',
  templateUrl: './profilmembre.component.html',
  styleUrls: ['./profilmembre.component.scss']
})
export class ProfilMembreComponent implements OnInit {

  constructor(
    private wsService: WsService,
    private membreClikService: MembreClikService,
    private authService: AuthService,
    private editerService: EditerService

  ) { }
  //********************************************************** */
  quiEstCo: any;
  niveau: any;
  mbVisiteEnCours: any;
  mb: any;
  base: any;
  format:any;
  vraiePhoto = false;
  parDefaut= true;
  ////////////////////////////////////////////////////////////////////////
  ngOnInit(): void {
    this.quiEstCo = this.authService.utilisateur.pseudo;
    this.niveau = this.authService.utilisateur.niveau;
    this.mbVisiteEnCours = this.membreClikService.membreClik;
    this.wsService.send("infoGeneralesMembre", this.mbVisiteEnCours);
    this.wsService.listen('miseAJourAutresMembres').subscribe(()=>{
      this.wsService.send("infoGeneralesMembre", this.mbVisiteEnCours);
    });
    this.wsService.listen('infoGeneralesMembreS').subscribe(info => {
      this.mb = info;
    });
        
    this.wsService.send("chargerPhoto", this.mbVisiteEnCours);
    this.wsService.listen("chargerPhotoS").subscribe((x:any)=>{
  
      this.base = x.image;
      this.format = x.format; 
      this.vraiePhoto = true;
      this.parDefaut = false;
    });

  }

  /////////////////////// ACTIONS SUR LA PÄGE DE L'AMI ////////////////////////////

  contenu = "";

  //  ECRIRE UN COMMENTAIRE : 
  publier(form: NgForm): void {
    let x = {
      pseudo: this.mbVisiteEnCours,
      auteur: this.quiEstCo,
      contenu: this.contenu
    }
    this.wsService.send('publier', x);
    this.wsService.listen('publierS').subscribe(() => {
      this.wsService.send('infoGeneralesMembre', this.mbVisiteEnCours);
    });
    this.contenu = "";

  }
  ajoutCom = false;
  ecrire(etat: boolean): void {
    this.ajoutCom = etat;
  }


  // SUPPRIMER UN COMMENTAIRE : ------------------------------------------

  deleteComment(auteur: any, contenu: any): void {
    let comment = {
      auteur: auteur,
      contenu: contenu,
      qui: this.mbVisiteEnCours
    }
    this.wsService.send("supprCommentaire", comment);
    this.wsService.listen('supprCommentaireS').subscribe(()=>{
      this.wsService.send('infoGeneralesMembre', this.mbVisiteEnCours);
    });
  }
    //REPONDRE à un commentaire: ------------------------------------------------------
 repEnCours = '';
  
 index:any;
  repondre1(auteur:any, contenu:any){
    const condition = (element:any) => element.auteur === auteur && element.contenu === contenu;
    this.index = (this.mb.msgPublics).findIndex(condition);
    this.mb.msgPublics[this.index].ajoutRep = true;
    
  }
  repondre2(auteur: any, contenu: any){


     let envoiRep = {
      page : this.mbVisiteEnCours,
      auteur: auteur,
      contenu: contenu,
      auteurRep: this.quiEstCo,
      contenuRep: this.repEnCours
    }
   
    this.wsService.send('repondreCom', envoiRep);
    this.wsService.listen('repondreComS').subscribe(()=>{
      this.wsService.send('infoGeneralesMembre', this.mbVisiteEnCours);
    });
    this.repEnCours= "";
    this.mb.msgPublics[this.index].ajoutRep = false;
    
 }

  // supprimer une réponse :
  suppr(auteur: any, contenu: any, auteurRep:any, contenuRep:any){
    let rep= {
      page :this.mbVisiteEnCours,
      auteur:auteur,
      contenu:contenu,
      auteurRep:auteurRep,
      contenuRep:contenuRep
    }
    this.wsService.send('supprRepCom', rep);
    this.wsService.listen('supprRepComS').subscribe(()=>{
      this.wsService.send('infoGeneralesMembre', this.mbVisiteEnCours);
    });
  }
  // SERVICE MEMBRE CLIK : 

  editerServ() {
    this.editerService.pseudoDePageEnCours = this.membreClikService.membreClik;
  }
  selectClik(ami:any){
    this.membreClikService.membreClik = ami;
    this.mbVisiteEnCours = ami;
   
    this.wsService.send("infoGeneralesMembre", ami);
    this.wsService.send("chargerPhoto",ami);
  
  }
  /////////////////////////////////
  //  VOIR LES AMIS :
 
  voirLesAmis = false;
  titreAmis = "voir mes amis";
  logoAmis = "oeil.png";
  voirAmis() {
    if (this.voirLesAmis === true) {
      this.voirLesAmis = false;
      this.titreAmis = "voir mes amis";
      this.logoAmis = "oeil.png";
    }
    else {
      this.voirLesAmis = true;
      this.titreAmis = "refermer la rubrique amis";
      this.logoAmis = "suppr.png";
    }
  }
  ///////////////////////// POUBELLE : SUPPRIMER LE PROFIL ///////////////////////

  notif="";
  notifVisible=false;
  choix = false;
  deleteProfil() {
    this.choix= true;
  }
  supprimerProfil() {
    this.wsService.send('supprimerUser', this.mbVisiteEnCours);
    this.wsService.listen("supprimerUserS").subscribe(() => {
      this.notifVisible=true;
      this.notif = 'L\'utilisateur "' + this.mbVisiteEnCours + '" a été supprimé avec succès.'
    
    });
  }
  annul() {
    this.choix=false;
  }
  //////////////////////////////////////////////////////
deco(){
  this.authService.deco();
}

}
