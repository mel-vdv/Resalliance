import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { WsService } from 'src/app/services/ws.service';
import { MembreClikService } from 'src/app/services/membre-clik.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chatt',
  templateUrl: './chatt.component.html',
  styleUrls: ['./chatt.component.scss']
})
export class ChattComponent implements OnInit {

  constructor(
    private wsService: WsService,
    private authService: AuthService,
    private membreClikService : MembreClikService,
    private router : Router
  ) { }
  ////////////////////////////////////////////////////////////////////////////////
  quiEstCo: any;
//------------
  amis: any;
  amisCo: any;
  amisDeco: any;
  listeChatencours: any;
  listeDemandea: any;
  listeInvitepar: any;
  y: any;
//-------------
  appChat=false;
  choix= false;
  attente = false;



  ///////////////////////////////////////////////////////////////////////////////////
  ngOnInit(): void {

//qui est connecté:
    this.quiEstCo = this.authService.utilisateur.pseudo; 
// liste de ses amis:
this.wsService.listen('miseAJourChat').subscribe(()=>{
  this.wsService.send("amis", this.quiEstCo);
});
    this.wsService.send("amis", this.quiEstCo);
    this.wsService.listen("amisS").subscribe((liste: any) => {
      if (liste[0]) {
        this.wsService.send("infoGeneralesAmis", liste);
        this.wsService.listen("infoGeneralesAmisS").subscribe((tableau: any) => {
 // liste des amis connectés:
          this.amisCo = tableau.filter((ami: any) => ami.statut === "connect");
          this.amisDeco = tableau.filter((ami: any) => ami.statut === "deconnect");
// mise en place des logo STATUTS :
        for (let i = 0; i < (this.amisCo).length; i++) {
          this.amisCo[i].logo= './../../../assets/plus2.png';
        }
 // mise à jour des statuts de amis connectés? 
 this.wsService.listen("miseAJourChat").subscribe(() => {
  this.wsService.send('chatEnCours', this.quiEstCo);
  this.wsService.send('invitePar', this.quiEstCo);
  this.wsService.send('enAttente', this.quiEstCo);
});
        //1. qui a la logo "chat en cours"?

        this.wsService.send("chatEnCours", this.quiEstCo);
        this.wsService.listen("chatEnCoursS").subscribe((maj: any) => {

          for (let x = 0; x < maj.length; x++) {

            for (let i = 0; i < (this.amisCo).length; i++) {

              if (maj[x] === this.amisCo[i].pseudo) {

                this.amisCo[i].logo = './../../../assets/discussionOk2.png';

              }
            //  else {
             //   console.log('suivant');
              //}
            }
          }
        });
        // 2. qui a le logo 'en attente'?
        this.wsService.send("enAttente", this.quiEstCo);
        this.wsService.listen("enAttenteS").subscribe((maj: any) => {

          for (let x = 0; x < maj.length; x++) {

            for (let i = 0; i < (this.amisCo).length; i++) {

              if (maj[x] === this.amisCo[i].pseudo) {

                this.amisCo[i].logo = './../../../assets/attente.png';

              }
              else {
                console.log('suivant');
              }
            }
          }
        });
        //3. qui a le logo "à ajouter"?
        this.wsService.send("invitePar", this.quiEstCo);
        this.wsService.listen("inviteParS").subscribe((maj: any) => {

          for (let x = 0; x < maj.length; x++) {

            for (let i = 0; i < (this.amisCo).length; i++) {

              if (maj[x] === this.amisCo[i].pseudo) {

                this.amisCo[i].logo = './../../../assets/inviteChat2.png';

              }
              else {
                console.log('suivant');
              }
            }
          }
        });
        });
/////////////////////////////////////////
      }
      else {
        console.log('liste damis vide');
      }
     

    });


  }
  /////////////////////////////   gestion des clics sur les logo  : ///////////////////////////////////////////////////

  proposeChat(ami: any) {
  
    let chat = {
      quiEstCo: this.quiEstCo,
      ami: ami
    }
    this.wsService.send("proposeChat", chat);
    this.appChat=false;  }
  //---------------------------------------------
  inviteur:any;
  choisir(ami :any){
    this.choix=true;
    this.appChat = false;
    this.attente = false;
    this.inviteur = ami;
  }
  //-------------------------------------------
  accepterInvit(ami: any) {
    let invit = {
      quiEstCo: this.quiEstCo,
      ami: ami
    }
    this.wsService.send("accepterChat", invit);
    this.choix = false;
  }
  //---------------------------------------------
  refuserInvit(ami: any){
    this.choix=false;
    let invit = {
      quiEstCo: this.quiEstCo,
      ami: ami
    }
    this.wsService.send("refuserChat", invit);
    this.choix = false;
  }
  //-----------------------------------------------
  chatter(ami: any) {
    this.membreClikService.membreClik = ami;
   // this.appChat=true;
   this.router.navigate(['/chattt']); 
   this.choix=false;
    this.attente = false;
  }
  //-------------------------------------------------
invite:any;
  attendre(ami:any){
    this.invite = ami;
    this.attente = true;
    this.appChat = false;
    this.choix= false;
  }
//--------------------------------------------------------
  actionLogo(logo: any, ami: any) {

    switch (logo) {
      case './../../../assets/discussionOk2.png': this.chatter(ami);
        break;

      case './../../../assets/plus2.png': this.proposeChat(ami);
        break;

      case './../../../assets/inviteChat2.png': this.choisir(ami);
        break;

      case './../../../assets/attente.png': this.attendre(ami);
        break;

      default: console.log('pb de logos');
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////
deco(){
  this.authService.deco();
}
}
