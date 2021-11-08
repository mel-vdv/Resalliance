import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { WsService } from 'src/app/services/ws.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mdp',
  templateUrl: './mdp.component.html',
  styleUrls: ['./mdp.component.scss']
})
export class MdpComponent implements OnInit {

  constructor(
    private wsService: WsService,
    private router: Router
  ) { }
  ////////////////////////////////////////////////////////////////////////
  pseudo :any;
  mail: any;
  etape1 = true;
  etape2 = false;
  mdpAleatoire = Math.random().toString(36);
  mdpAleatoireTest:any;
  mdpNew = "";
  messageAlerte = "";
  /////////////////////////////////////////////////////////////////////////////
  ngOnInit(): void {
    this.messageAlerte = "";
    this.mdpNew = "";
    this.mdpAleatoireTest="";
    this.etape1 = true;
    this.etape2 = false;
  }
  //--------------------------------------------------------------------------
  mdpOubli(form: NgForm) {
    if (form.valid) {
      let message = {
        to: this.mail,
        subject: "réinitialisation du mot de passe",
        text: "Bonjour " + this.pseudo + ". Suite à votre demande de réinitialisation de mdp, voici un code transitoire : " + this.mdpAleatoire
      }
      let code = {
        mail: this.mail,
        pseudo: this.pseudo
      }
      this.wsService.send('mdpAleatoire', code); // verif si pseudo et email correspondent
      console.log('1 : '+this.mdpAleatoire);
      this.wsService.listen('mdpAleatoireS').subscribe((cas1ou2: any) => {
        if(cas1ou2 === 1){
        this.messageAlerte= "un code transitoire vous a été envoyé par mail.";
        this.wsService.send('envoiMail', message); // si oui : envoie code aleatoire
        this.etape2 = true;
        this.etape1 = false;
        }
        else{
          console.log('cas2');
          this.messageAlerte = "pseudo et/ou adresse email incorrect(e/s). Veuillez retenter.";
        }
       
      });
    }
  }
  //-------------------------------------------------------------------------------
  reinitialiserMdp(form: NgForm): void {
    console.log('2 : '+this.mdpAleatoire);
    if (this.mdpAleatoire === this.mdpAleatoireTest) { // verif si code aleatoire correct
      this.messageAlerte="";
      let code = {
        pseudo: this.pseudo,
        newMdp: this.mdpNew
      }
      this.wsService.send('nouveauMdp', code); //si oui : enregistrement du nouveau mdp
      this.wsService.listen('nouveauMdpS').subscribe(() => {
        this.router.navigate(['/connexion']); // quand c'est fait redirige vers connexion
      });
    }
    else { // si non : message erreur
      this.messageAlerte = "Le code aleatoire est incorrect. Veuillez retenter.";
    }
  }
}
