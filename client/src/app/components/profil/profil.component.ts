import { Component, OnInit } from '@angular/core';
import { WsService } from 'src/app/services/ws.service';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MembreClikService } from 'src/app/services/membre-clik.service';
import { EditerService } from 'src/app/services/editer.service';
import { LiaisonEntreCompService } from 'src/app/services/liaison-entre-comp.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {

  constructor(
    private wsService: WsService,
    private authService: AuthService,
    private membreClikService: MembreClikService,
    private editerService: EditerService,
    private liaisonEntreCompService: LiaisonEntreCompService
  ) {
  }
  quiEstCo: any;
  niveau = this.authService.utilisateur.niveau;
  moi: any = {
  };
  nbRecos: any;
  nbDemandes: any;
  base: any;
  format:any;
  vraiePhoto = false;
  parDefaut= true;
  ///////////////////////////////////////////////////////
  definirMembreClik(ami: any): void {
    this.membreClikService.membreClik = ami;
    console.log('membreClique:' + this.membreClikService.membreClik);
  }
  membreClique = this.membreClikService.membreClik;
  //////////////////////////////////////////////////////////////////////////////////////////////////////
  ngOnInit(): void {
    // les informations générales de l'utilisateur connecté : 
    this.quiEstCo = this.authService.utilisateur.pseudo;
    this.wsService.send('infoGeneralesMembre', this.quiEstCo);
    this.wsService.listen('miseAJourAutresMembres').subscribe(()=>{
     this.wsService.send('infoGeneralesMembre', this.quiEstCo);
     this.wsService.send('nbRecom', this.quiEstCo);
   });
    this.wsService.listen('infoGeneralesMembreS').subscribe((objetInfo: any) => {
      this.moi = objetInfo;
      this.nbDemandes = this.moi.demandeurs.length;
      
      for(let i=0;i<this.moi.msgPublics.length ;i++){this.moi.msgPublics[i].ajoutRep = false;}
      
    });
    //this.wsService.listen('ajouterAmiS').subscribe(() => {
   //   this.wsService.send('infoGeneralesMembre', this.quiEstCo);
   // });
    this.wsService.send('nbRecom', this.quiEstCo);
    this.wsService.listen('nbRecomS').subscribe((nb) => {
      if (nb) {
        this.nbRecos = nb;
        this.liaisonEntreCompService.nbRecos = nb;
      }
      else {
        console.log('pas de reco');
      }
    });

     
    this.wsService.send("chargerPhoto", this.quiEstCo);
    this.wsService.listen("chargerPhotoS").subscribe((x:any)=>{
  
      this.base = x.image;
      this.format = x.format; 
      this.vraiePhoto = true;
      this.parDefaut = false;
    });
  }


  //////////////////////////////////////////////////////////////////////////////////
  //////////////////////////     LES FONCTIONS     /////////////////////////////////
  //----------------------------------------------------
  editerServ() {
    this.editerService.pseudoDePageEnCours = this.quiEstCo;
  }
  //-----------------------------------------------------
  deleteProfil() { }

  // 1. les commentaires : 
  //  ECRIRE UN COMMENTAIRE : -----------------------------------------------------
  contenu: any;
  publier(form: NgForm): void {
    let x = {
      pseudo: this.quiEstCo,
      auteur: this.quiEstCo,
      contenu: this.contenu
    }
    this.wsService.send('publier', x);
    this.wsService.listen('publierS').subscribe(() => {
      this.wsService.send('infoGeneralesMembre', this.quiEstCo);
     // this.wsService.send("autresMembres", this.quiEstCo);
    });
    this.contenu = "";

  }
   
  ajoutCom = false;
  ecrire(etat: boolean): void {
    this.ajoutCom = etat;
  }
  //REPONDRE à un commentaire: ------------------------------------------------------
 repEnCours = '';
  
 index:any;
  repondre1(auteur:any, contenu:any){
    const condition = (element:any) => element.auteur === auteur && element.contenu === contenu;
    this.index = (this.moi.msgPublics).findIndex(condition);
    this.moi.msgPublics[this.index].ajoutRep = true;
    console.log('index = '+this.index);
  }
  repondre2(auteur: any, contenu: any){
   console.log('on envoie..');

     let envoiRep = {
      page : this.quiEstCo,
      auteur: auteur,
      contenu: contenu,
      auteurRep: this.quiEstCo,
      contenuRep: this.repEnCours
    }
   
    this.wsService.send('repondreCom', envoiRep);
    this.wsService.listen('repondreComS').subscribe(()=>{
      this.wsService.send('infoGeneralesMembre', this.quiEstCo);
    });
    this.repEnCours= "";
    this.moi.msgPublics[this.index].ajoutRep = false;
    
 }
  // supprimer un commentaire (si admin ou si auteur du commentaire): -------------------
  delete(auteur: any, contenu: any) {
    let x = {
      qui: this.quiEstCo,
      auteur: auteur,
      contenu: contenu
    }
    this.wsService.send('supprCommentaire', x);
    this.wsService.listen('supprCommentaireS').subscribe(() => {
      this.wsService.send('infoGeneralesMembre', this.quiEstCo);
     // this.wsService.send("autresMembres", this.quiEstCo);
    });
  }
  // supprimer une réponse :
  suppr(auteur: any, contenu: any, auteurRep:any, contenuRep:any){
    let rep= {
      page :this.quiEstCo,
      auteur:auteur,
      contenu:contenu,
      auteurRep:auteurRep,
      contenuRep:contenuRep
    }
    this.wsService.send('supprRepCom', rep);
    this.wsService.listen('supprRepComS').subscribe(()=>{
      this.wsService.send('infoGeneralesMembre', this.quiEstCo);
    });
  }
  // 2. les demandes d'amis : 
  //REPONDRE A UNE DEMANDE D'AMIS : --------------------------------------------------------
  demande: any = {
    de: '',
    a: ''
  }
  messageAcceptApparait = false;
  messageRefusApparait = false;
  alerteDemande = "voici les demandes en cours :";
  accepter(ami: any) {
    this.alerteDemande = 'la personne "' + ami + '" a été ajoutée à votre liste d\'amis.';
    this.demande.de = ami;
    this.demande.a = this.quiEstCo;
    this.messageAcceptApparait = true;
    this.wsService.send("demandeAcceptee", this.demande);
  //  this.wsService.listen("demandeAccepteeS").subscribe(() => {
     // this.wsService.send('infoGeneralesMembre', this.quiEstCo);
      //this.wsService.send('autresMembres', this.quiEstCo);
  //  });
  }
  refuser(ami: any) {
    this.alerteDemande = "La demande d'amis de " + ami + ' a été ignorée.';
    this.demande.de = ami;
    this.demande.a = this.quiEstCo;
    this.messageRefusApparait = true;
    this.wsService.send("demandeRefusee", this.demande);
  //  this.wsService.listen("demandeRefuseeS").subscribe(() => {
    //  this.wsService.send('infoGeneralesMembre', this.quiEstCo);
      //this.wsService.send('autresMembres', this.quiEstCo);
    //});

  }
  msgPart(): void {
    this.messageAcceptApparait = false;
    this.messageRefusApparait = false;
  }
  // 3. RECHERCHER UN AMI : -------------------------------------------------
  listeResult :any;
  rechercheActive = false;
  inputRecherche = "recherche par pseudo/nom/prénom...";
  rechercheEnCours() {
    this.rechercheActive = true;
  }
  blanc() {
    this.inputRecherche = "";
  }
  stopRecherche() {
    this.rechercheActive = false;
  }
  chercher() {
    var regex = "^" + this.inputRecherche;
    this.wsService.send("chercherPseudo", regex);
    this.wsService.listen('chercherPseudoS').subscribe((result: any) => {
      this.listeResult = result;
      this.inputRecherche = "recherche par pseudo / nom / prénom ";
    });
  }
  // OEIL : aller sur le profil d'un ami:
  selectClik(ami:any){
    this.membreClikService.membreClik = ami;
  }
  //------------------------------------------------------------------------
  // 4. afficher la rubrique :
  // a/ amis :
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
  //b. / demandes d'amis :
  voirLesDemandes = false;
  titreDemandes = "voir les demandes d'amis";
  logoDemandes = "oeil.png";
  voirDemandes() {
    if (this.voirLesDemandes === true) {
      this.voirLesDemandes = false;
      this.titreDemandes = "voir les demandes d'amis";
      this.logoDemandes = "oeil.png";
    }
    else {
      this.voirLesDemandes = true;
      this.titreDemandes = "refermer la rubrique demande d'amis";
      this.logoDemandes = "suppr.png";
    }
  }
  // c/ les recommandations: 
  voirLesReco = false;
  titreReco = "voir les recommandations";
  logoReco = "oeil.png";
  voirReco() {
    if (this.voirLesReco === true) {
      this.voirLesReco = false;
      this.titreReco = "voir les recommandations";
      this.logoReco = "oeil.png";
    }
    else {
      this.voirLesReco = true;
      this.titreReco = "refermer la rubrique recommandations";
      this.logoReco = "suppr.png";
    }
  }
  // d/ les autres membres: 
  voirMembr = false;
  titreMb = "voir les autres membres";
  logoMb = "oeil.png";

  voirMembres() {
    if (this.voirMembr === true) {
      this.voirMembr = false;
      this.titreMb = "voir les autres membres";
      this.logoMb = "oeil.png";
    }
    else {
      this.voirMembr = true;
      this.titreMb = "refermer la rubrique autres membres";
      this.logoMb = "suppr.png";
    }
  }
  //------------------------------------------------------------
  deco(){
    this.authService.deco();
  }
}

