import { Component, OnInit } from '@angular/core';
import { AdresseMailService } from 'src/app/services/adresse-mail.service';
import { AuthService } from 'src/app/services/auth.service';
import { EditerService } from 'src/app/services/editer.service';
import { MembreClikService } from 'src/app/services/membre-clik.service';
import { WsService } from 'src/app/services/ws.service';

@Component({
  selector: 'app-amis',
  templateUrl: './amis.component.html',
  styleUrls: ['./amis.component.scss']
})
export class AmisComponent implements OnInit {

  constructor(
    private wsService: WsService,
    private membreClikService: MembreClikService,
    private authService: AuthService,
    private adresseMailService: AdresseMailService,
    private editerService: EditerService
  ) { }
  /////////////////////////////////////////////////////////////
  quiEstCo: any;
  niveau: any;
  amiClik: any;
  amis: any;
  selectClik(ami: any) {
    this.membreClikService.membreClik = ami;

  }
  //-------------affichage de messages alertes:----------------------
  message = "";
  affichageMsg = false;
  recoAlerte = false;
  close() {
    this.affichageMsg = false;
  }
  fermer(){
    this.recoAlerte = false;
  }
  //************************************************************************************ */
  ngOnInit(): void {
    this.quiEstCo = this.authService.utilisateur.pseudo;
    this.authService.quelNiveau();
    this.niveau = this.authService.utilisateur.niveau;
    this.wsService.send("amis", this.quiEstCo);
    this.wsService.listen('miseAJourAutresMembres').subscribe(()=>{
      this.wsService.send("amis", this.quiEstCo);
    });
    this.wsService.listen("amisS").subscribe((liste: any) => {
      this.amis = liste;
      this.wsService.send("infoGeneralesAmis", liste);
      this.wsService.listen("infoGeneralesAmisS").subscribe((infos: any) => {
        this.amis = infos;
        for(let i=0; i<infos.length; i++){
          this.amis[i].logosVisibles = false;
        }
      });
    });
  }
  //************************************************************************************** */
  //  ACTIONS SUR LES AMIS :
  /*
  1. voir profil (router : /profilmembre)
  2. retirer de la liste d'amis
  3. recommander
  4. envoyer un message (router: /messagerie)
  5. editer le profil (admin) (router /editer)
  6. supprimer le profil (admin)
  */
  //------------------------- 2.retirer de la liste d'amis --------------------------------------------------
  retirerDeListe(ami: any): void {
    let duo = {
      quiEstCo: this.quiEstCo,
      membreclik: ami
    }
    this.wsService.send("retirerDeListe", duo);
    this.wsService.listen('retirerDeListeS').subscribe((liste: any) => {
      this.amis = liste;
      this.message = duo.membreclik + " a été retiré avec succès de votre liste d'amis."
      this.affichageMsg = true;
      this.wsService.send("amis", this.quiEstCo);
    });
  }
  //------------------------------- 3.recommander à un ami -----------------------------------------------
  
  membreclik: any;
  destinataire: any;
  adressDestinataire: any;
  reco(ami: any) {
    this.membreclik = ami;
    this.recoAlerte = true;
  }
  recommander() {
    console.log('on recommande');
    let trio = {
      recommande: this.membreclik,
      recommandeur: this.quiEstCo,
      destinataire: this.destinataire
    }
    // etape 1 : 
    this.wsService.send('controlePreReco', trio);
    this.wsService.listen('controlePreRecoS').subscribe((reponse) => {
      console.log('reponse :' + reponse);
      if (reponse) {
        // etape 2:
        this.wsService.send('recommander', trio);
        this.wsService.listen('recommanderS').subscribe(() => {
          this.affichageMsg = true;
          this.recoAlerte = false;
          this.message = "Votre recommandation de " + this.membreclik + " a été envoyée avec succès à " + this.destinataire;
        this.adresseMailService.trouverAdresseMail(this.destinataire);
          this.wsService.listen('trouverAdresseMailS').subscribe(adresse => {
            let mail = {
              to: adresse,
              subject: this.quiEstCo + ' vous recommande ' + this.membreclik + ' comme ami(e).',
              text: this.quiEstCo + ' vous recommande ' + this.membreclik + ' comme ami(e).'
            }
            this.wsService.send('envoiMail', mail);
          });
        });
      }
      else {
        this.affichageMsg = true;
        this.recoAlerte = false;
        this.message = "Ces 2 personnes sont déjà amies."
      }


    });
  }
  //-----------------------------5. editer le profil (admin)----------------------------------------------
  editer(x: any) {
    this.editerService.pseudoDePageEnCours = x;
    this.membreClikService.membreClik = x;
  }
  //-----------------------------6.supprimer le profil (admin) ------------------------------------------------
  supprProfil(pseudoASuppr: any): void {
    let pseudoDelete = pseudoASuppr;
    console.log('membres.ts : suppr profil de ' + pseudoDelete);
    this.wsService.send('supprProfil', pseudoDelete);
  }
  /////////////////////////////

  mouseover(ami:any){
    let index= this.amis.findIndex((e:any)=> e.pseudo === ami);
    this.amis[index].logosVisibles = true;
  }
  mouseout(ami:any){
    let index= this.amis.findIndex((e:any)=> e.pseudo === ami);
    this.amis[index].logosVisibles = false;
  }

}
