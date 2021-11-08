import { Component, OnInit } from '@angular/core';
import { WsService } from 'src/app/services/ws.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-messagerie',
  templateUrl: './messagerie.component.html',
  styleUrls: ['./messagerie.component.scss']
})
export class MessagerieComponent implements OnInit {

  constructor(
    private wsService: WsService,
    private authService: AuthService
  ) {
  }
  //////////////////////////////////////////////
  quiEstCo: any;
  niveau: any;
  theme: any;
  discussions: any;


  /////////////////////////////////////////////////
  ngOnInit(): void {
    this.quiEstCo = this.authService.utilisateur.pseudo;
    this.niveau = this.authService.utilisateur.niveau;
    if (this.niveau === 1) {
      this.wsService.send('chargerMessagerieNiv1', '');
      this.wsService.listen('chargerMessagerieNiv1S').subscribe((list) => {
        this.discussions = list;
      });
    }
    else {
      this.wsService.send('chargerMessagerieNiv2', this.quiEstCo);
      this.wsService.listen('chargerMessagerieNiv2S').subscribe((liste) => {
        this.discussions = liste;
      });
    }   
    this.wsService.listen('majListDisc').subscribe(() => {
      if (this.niveau === 1) {
        this.wsService.send('chargerMessagerieNiv1', '');
        this.wsService.listen('chargerMessagerieNiv1S').subscribe((list) => {
          this.discussions = list;
        });
      }
      else {
        this.wsService.send('chargerMessagerieNiv2', this.quiEstCo);
        this.wsService.listen('chargerMessagerieNiv2S').subscribe((liste) => {
          this.discussions = liste;
        });
      }   
    });

    }
  
  //////////////////////////////////////////////////
  //-------------------------   clic poubelle -------------------------------------------
  sure = false;
  delet: any;
  deleteDisc(creat: any, them: any) {
    this.sure = true;
    this.delet = {
      createur: creat,
      theme: them
    }
  }
  confirm() {
    this.wsService.send('supprDisc', this.delet);
    this.wsService.listen('supprDiscS').subscribe(() => {
      this.sure = false;
      this.wsService.send('chargerMessagerie', this.quiEstCo);
    });
  }
  annul() {
    this.sure = false;
    console.log('ope annulée');
  }
  //*******************************************************************
  deco(){
    this.authService.deco();
  }
}
