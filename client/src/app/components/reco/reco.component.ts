import { Component, OnInit } from '@angular/core';
import { AdresseMailService } from 'src/app/services/adresse-mail.service';
import { AuthService } from 'src/app/services/auth.service';
import { LiaisonEntreCompService } from 'src/app/services/liaison-entre-comp.service';
import { WsService } from 'src/app/services/ws.service';

@Component({
  selector: 'app-reco',
  templateUrl: './reco.component.html',
  styleUrls: ['./reco.component.scss']
})
export class RecoComponent implements OnInit {

  constructor(
    private wsService: WsService,
    private authService: AuthService,
    private adresseMailService: AdresseMailService,
    private liaisonEntreCompService: LiaisonEntreCompService) { }

  recos: any;
  nbRecos:any;
  quiEstCo: any;
  message = "";
  ajouterAmi: any;
  ngOnInit(): void {
    this.quiEstCo = this.authService.utilisateur.pseudo;
    this.wsService.send('listeReco', this.quiEstCo);
    this.wsService.listen('listeRecoS').subscribe((listeReco) => {
      this.recos = listeReco;
      //this.liaisonEntreCompService.nbRecos= this.recos.length;
    });
  }
  // envoyer une demande d'amis:********************************************
  ajouter(recommande: any, recommandeur: any): void {
    this.message = "Votre invitation a été envoyée avec succès à " + recommande + ', veuillez attendre que la personne accepte.';
    let reco = {
      destinataire: this.quiEstCo,
      recommande: recommande,
      recommandeur: recommandeur
    }
    this.wsService.send('ignorerReco', reco);
    this.wsService.listen('ignorerRecoS').subscribe(() => {
      this.wsService.send('listeReco', this.quiEstCo);

      let ajoutAmi = {
        de: this.quiEstCo,
        a: recommande
      }
      this.wsService.send("ajouterAmi", ajoutAmi);
      console.log("on ajouter ami = " + ajoutAmi.de + ajoutAmi.a);


    });

    /*this.adresseMailService.trouverAdresseMail(this.ajouterAmi.a);
    let adr = this.adresseMailService.adresseEmail;
    let email = {
      to: adr,
      subject: 'Resalliance: nouvelle demande d\'amis.',
      text: 'Bonjour ' + this.ajouterAmi.a + ', ' + this.quiEstCo + ' vous a envoyé une demande d\'amis sur votre réseau social Resalliance.'
    };
    this.wsService.send('envoiMail', email);*/

  }
  // ignorer cette reco:******************************************************
  ignorer(recommande: any, recommandeur: any): void {
    this.message = "la recommandation de " + recommande + " envoyé par " + recommandeur + " a bien été ignorée.";
    let reco = {
      destinataire: this.quiEstCo,
      recommande: recommande,
      recommandeur: recommandeur
    }
    this.wsService.send('ignorerReco', reco);
    this.wsService.listen('ignorerRecoS').subscribe(() => {
      this.wsService.send('listeReco', this.quiEstCo);
      this.wsService.send('nbRecom', this.quiEstCo);
    });
  }
}
