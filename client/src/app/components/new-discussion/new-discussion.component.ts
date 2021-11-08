import { Component, OnInit } from '@angular/core';
import { WsService } from 'src/app/services/ws.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LiaisonEntreCompService } from 'src/app/services/liaison-entre-comp.service';

@Component({
  selector: 'app-new-discussion',
  templateUrl: './new-discussion.component.html',
  styleUrls: ['./new-discussion.component.scss']
})
export class NewDiscussionComponent implements OnInit {

  constructor(
    private wsService: WsService,
    private authService: AuthService,
    private router: Router
  ) { }
  ///////////////////////////////////
  quiEstCo: any;
  niveau: any;
  newTheme: any;
  listeInvites: any ;
  participants: any = [];
  message='';

  ///////////////////////////////////////
  ngOnInit(): void {
    this.quiEstCo = this.authService.utilisateur.pseudo;
    this.niveau = this.authService.utilisateur.niveau;
  
    if (this.niveau === 2) {

      this.wsService.send('amis', this.quiEstCo);
      this.wsService.listen('amisSbis').subscribe((list: any) => {

        for (let i = 0; i < list.length; i++) {
          this.listeInvites = list;
          this.listeInvites[i].src = "./../../../assets/case.png";
          this.listeInvites[i].coche = false;
          this.listeInvites[i].classe = "deselect";
        }
      });
    }
    else {
    
      this.wsService.send('tousMembres', this.quiEstCo);
      this.wsService.listen('tousMembresS').subscribe((list: any) => {
      
        for (let i = 0; i < list.length; i++) {
          this.listeInvites = list;
          this.listeInvites[i].src = "./../../../assets/case.png";
          this.listeInvites[i].coche = false;
          this.listeInvites[i].classe = "deselect";
        }
        
      });
    }
  }
  /////////////////////////////////////////////////////////////////
  cocher(ami: any) {
  
    const condition = (e: any) => e.pseudo === ami;
    let i = this.listeInvites.findIndex(condition);
   
    if (this.listeInvites[i].coche) {

      this.listeInvites[i].coche = false;
      this.listeInvites[i].src = "./../../../assets/case.png";
      this.participants.splice(i,1);
      this.listeInvites[i].classe = "deselect";
    }
    else {

      this.listeInvites[i].coche = true;
      this.listeInvites[i].src = "./../../../assets/caseCochee.png";
      this.listeInvites[i].classe= "select";

      this.participants.push(ami);
    }
  }
  //----------------------------------------------------------------------
  creer(form: NgForm): void {
    if(form.valid){
      this.participants.push(this.quiEstCo);
      let newD = {
        createur: this.quiEstCo,
        theme: this.newTheme,
        participants: this.participants
      }
      this.wsService.send('newDiscussion', newD);
      this.wsService.listen('newDiscussionS').subscribe(() => {
        this.router.navigate(['/messagerie']);
      });
    
  }
  else{
     this.message = "Merci de compléter les champs incomplets."
  }
    }
//////////////////////////
deco(){
  this.authService.deco();
}
}
