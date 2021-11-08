
import { Component, OnInit } from '@angular/core';
import { EditerService } from 'src/app/services/editer.service';
import { WsService } from 'src/app/services/ws.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  /////////////////////////   LES VARIABLES DU HTML  ///////////////
  quiEstCo: any;
  connexions: any;
  listeDeCommentaires: any;
  listeDeMurs: any;
  messageAdmin = "";
  messageVisibleAdmin = false;
  messageVisiteur = "";
  messageVisibleVisiteur = false;
  saisie: any = {
    pseudo: "",
    mdp: ""
  }
  nbMbTotal:any;
  nbMbConnect:any;
  nbMsg : any;
  nbComm : any;
  nbChat : any;
  
  ////////////////////////   LES SERVICES  /////////////
  constructor(
    private editerService: EditerService,
    private wsService: WsService
  ) { }
  ///////////////////////////////   ON INIT   ////////////////
  ngOnInit(): void {
    // partie visiteur: 
   
      this.wsService.send('accueil','');
      this.wsService.listen("majStat").subscribe(()=>{
        this.wsService.send('accueil','');
      });
      this.wsService.listen('accueilSnbTot').subscribe((nbTotal:any) => {
        this.nbMbTotal = nbTotal;
      });
      this.wsService.listen('accueilSMbCo').subscribe((accueilSMbCo:any) => {
        this.nbMbConnect = accueilSMbCo;
      });
      this.wsService.listen('accueilSmsg').subscribe((accueilSmsg:any) => {
        this.nbMsg = accueilSmsg;
      });
      this.wsService.listen('accueilSCom').subscribe((accueilSCom:any) => {
        this.nbComm = accueilSCom;
      });
      this.wsService.listen('accueilSChat').subscribe((accueilSChat:any) => {
        this.nbChat = accueilSChat;
      });
    
    //ecoute en cas de mise à jour.... partie administrateur:
    this.wsService.listen('majAdmin').subscribe(() => {
      this.wsService.send("adminConnexions", '');
      this.wsService.listen('adminConnexionsS').subscribe((liste: any) => {
        this.connexions = liste;
      });
    });
  }
  ////////////////  connexion de administrateur ///////////////
  // on controle pseudo, mdp et niveau = 1 : 
  admin = false;
  verif() {

    this.wsService.send('verifAdmin', this.saisie);
    this.wsService.listen('verifAdminS').subscribe((reponse: any) => {
      if (reponse) {
        this.admin = true;
        this.wsService.send("adminConnexions", '');
        this.wsService.listen('adminConnexionsS').subscribe((liste: any) => {
          this.connexions = liste;
          for (let i = 0; i < liste.length; i++) {
            this.connexions[i].voirConnexions = false;
            this.connexions[i].voirComment = false;
          }
        });
      }
      else {
        this.admin = false;
        this.messageVisibleVisiteur = true;
        this.messageVisiteur = "Désolé, vous n'êtes pas autorisé à accéder à l'espace administrateur."
      }

    });
  }
  ///////////////////  liste des commentaires ////////////////////
  xxx:any;
  listeCom(pseudo: any) {
    let ind = this.connexions.findIndex((e: any) => e.pseudo === pseudo);
    this.connexions[ind].voirComment = true;
    this.wsService.send('listComm', pseudo);
    this.wsService.listen('listCommS').subscribe((list) => {
      this.listeDeCommentaires = list;
    });
    this.wsService.listen('listMurs').subscribe((list: any) => {
      this.listeDeMurs = list;
      this.xxx=[];
      for (let x = 0; x < list.length; x++) {
        this.xxx.push(`"${this.listeDeCommentaires[x]}" écrit sur le mur de "${this.listeDeMurs[x]}"`);
      }
    });
  }


  fermerComm(ami: any) {
    let indice = this.connexions.findIndex((e: any) => e.pseudo === ami);
    this.connexions[indice].voirComment= false;
  }

  //////////////////////  voir les Connexions //////////////////////// 

  voirCo(ami: any) {
    let ind = this.connexions.findIndex((e: any) => e.pseudo === ami);
    this.connexions[ind].voirConnexions = true;
  }
  fermerCo(ami: any) {
    let indice = this.connexions.findIndex((e: any) => e.pseudo === ami);
    this.connexions[indice].voirConnexions = false;
  }

  ////////////////////// les actions editer et supprimer////////////
  select(membre: any) {
    this.editerService.pseudoDePageEnCours = membre;
  }
  profilAsuppr = "";
  choix = false;
  deleteProfil(membre: any) {
    this.profilAsuppr = membre;
    this.choix = true;
  }
  supprimerProfil() {
    this.choix = false;
    this.wsService.send('supprimerUser', this.profilAsuppr);
    this.wsService.listen("supprimerUserS").subscribe(() => {
      this.messageVisibleAdmin = true;
      this.messageAdmin = 'L\'utilisateur "' + this.profilAsuppr + '" a été supprimé avec succès.'
    });
  }
  annul() {
    this.choix = false;
  }
  /////////////  FERMER les alertes:////////////////////

  fermer() {
    this.messageVisibleAdmin = false;
  }

  fermer2() {
    this.messageVisibleVisiteur = false;
  }
}
