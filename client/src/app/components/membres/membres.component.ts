import { Component, OnInit } from '@angular/core';
import { WsService } from 'src/app/services/ws.service';
import { AuthService } from 'src/app/services/auth.service';
import { MembreClikService } from 'src/app/services/membre-clik.service';
import { AdresseMailService } from 'src/app/services/adresse-mail.service';
import { EditerService } from 'src/app/services/editer.service';

@Component({
  selector: 'app-membres',
  templateUrl: './membres.component.html',
  styleUrls: ['./membres.component.scss']
})
export class MembresComponent implements OnInit {

  constructor(
    private wsService: WsService,
    private authService: AuthService,
    private membreClikService: MembreClikService,
    private adresseMailService: AdresseMailService,
    private editerService: EditerService
  ) { }
  /////////////////////////////////////////////////////////////////////////////
  quiEstCo: any;
  niveau: any;
  membres: any = [
  ];

  //----------------------------------------
  /////////////////////////  les ALERTES messages //////////////////////
  messageVisible = false;
  msgAlerte :any;
  msgDisparait(){
    this.messageVisible = false;
  }
  /////////////////////////////////////////////////////////////////////////
  ngOnInit(): void {
    this.quiEstCo = this.authService.utilisateur.pseudo;
    this.niveau = this.authService.utilisateur.niveau;
    // charge liste des membres "pas amis": 
    this.wsService.send('autresMembres', this.quiEstCo);
    this.wsService.listen('miseAJourAutresMembres').subscribe(()=>{
      this.wsService.send('autresMembres', this.quiEstCo);
    });
    this.wsService.listen("autresMembresS").subscribe((list: any) => {
 
      this.membres = list;
      
      for (let i = 0; i < this.membres.length; i++) {
        if ((this.membres[i].demandeurs.find((e: any) => this.quiEstCo)) === this.quiEstCo) {
          this.membres[i].quelLogo = "attente";
          console.log('log: '+i+" "+this.membres[i].quelLogo+" "+ this.membres[i].pseudo);
        }
        else if ((this.membres[i].receveurs.find((e: any) => this.quiEstCo)) === this.quiEstCo) {
          this.membres[i].quelLogo = "invitt";
          console.log('log: '+i+" "+this.membres[i].quelLogo+" "+ this.membres[i].pseudo);
        }
        else {
          this.membres[i].quelLogo = "plus";
          console.log('log: '+i+" "+this.membres[i].quelLogo+" "+ this.membres[i].pseudo);
        }

      }
    });
       let i = 0;
 while (i < this.membres.length) {
  
      if (((this.membres[i].demandeurs).find((e: any) => e = this.quiEstCo)) === this.quiEstCo) {
        this.membres[i].quelLogo = "attente";
        console.log(this.membres[i].quelLogo+ 'et'+this.membres[i].pseudo);
          i++;
       // return this.membres[i].quelLogo;
       
      }

      else if (((this.membres[i].receveurs).find((v: any) => v = this.quiEstCo))=== this.quiEstCo) {
          this.membres[i].quelLogo = "invitt";
          console.log(this.membres[i].quelLogo + 'et' + this.membres[i].pseudo);
           i++;
          //return this.membres[i].quelLogo;
          
        }
        else {
          this.membres[i].quelLogo = "plus"; 
          console.log(this.membres[i].quelLogo + ' et '+ this.membres[i].pseudo);
          i++;
          //return this.membres[i].quelLogo;
     }}
       


  }
  //*****************************  ACTIONS PAR CLIC ******************************** */
  //1. voir le profil (clik sur oeil):-----------------------------router : /profilmembre
  clicOeil(mb: any) {
    this.membreClikService.membreClik = mb;
  }
  // 2. envoyer une demande d'ami (clik sur plus):-------------------------------------  +email  ---
  ajouterAmi: any = {
    de: '',
    a: ""
  }
  ajouter(ami: any){
    this.messageVisible = true;
    this.msgAlerte = "Votre invitation a été envoyée avec succès à " + ami+ ", veuillez attendre que la personne accepte.";
 
    this.ajouterAmi.de = this.quiEstCo;
    this.ajouterAmi.a = ami;
  
    this.wsService.send("ajouterAmi", this.ajouterAmi);
    this.wsService.listen("ajouterAmiS").subscribe(() => {
      this.wsService.send('infoGeneralesMembre', this.quiEstCo);
      this.wsService.send('autresMembres', this.quiEstCo);
      this.adresseMailService.trouverAdresseMail(ami);
      let adr = this.adresseMailService.adresseEmail;
      
      let email = {
        to: adr,
       subject: 'Resalliance: nouvelle demande d\'amis.',
       text: 'Bonjour ' + ami + ', ' + this.quiEstCo + ' vous a envoyé une demande d\'amis sur votre réseau social Resalliance.'
        };
       this.wsService.send('envoiMail', email);
    });
  }
  //3. si admin : editer le profil(clik sur crayon)-----------------------router : /editer
  clicCrayon(ami: any) {
    this.membreClikService.membreClik = ami;
    this.editerService.pseudoDePageEnCours = ami;
  }
  //4. si admin : supprimer un profil (clik sur poubelle)---------------------------- + email-------
  supprProfil(pseudoASuppr: any): void {
    let pseudoDelete = pseudoASuppr;
    this.adresseMailService.trouverAdresseMail(pseudoDelete);
    let adr = this.adresseMailService.adresseEmail;
    let email = {
      to: adr,
      subject: 'Resalliance: profil supprimé.',
      text: 'Bonjour ' + pseudoDelete + ', votre profil Resalliance a été supprimé du réseau.'
    };
    this.wsService.send('envoiMail', email);
    this.wsService.send('supprProfil', pseudoDelete);
    this.wsService.listen("supprProfilS").subscribe(() => {
      this.wsService.send('autresMembres', this.quiEstCo); //mise à jour tous sockets
      this.msgAlerte = 'Le profil de ' + pseudoDelete + ' a été supprimé.'
      this.messageVisible = true;
    });
  }
}