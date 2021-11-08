import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { WsService } from 'src/app/services/ws.service';
import { MembreClikService } from 'src/app/services/membre-clik.service';

@Component({
  selector: 'app-chattt',
  templateUrl: './chattt.component.html',
  styleUrls: ['./chattt.component.scss']
})
export class ChatttComponent implements OnInit {

  constructor(
    private wsService: WsService,
    private authService: AuthService,
    private membreClikService: MembreClikService
  ) { }
  quiEstCo: any;
  interlocuteur: any
  convs: any;
  onRepond: any;
  repEnv = '';
  debutConv = false;

  dateDuJour = new Date();
  jour = this.dateDuJour.getDate();
  mois = this.dateDuJour.getMonth();
  annee = this.dateDuJour.getFullYear();
  //////////////////////////////////////////////////////////////////////
  ngOnInit(): void {
    this.onRepond = false;

    this.interlocuteur = this.membreClikService.membreClik;
    this.quiEstCo = this.authService.utilisateur.pseudo;
    let quelConv = {
      quiestco: this.quiEstCo,
      interlocuteur: this.interlocuteur
    }
    this.wsService.send('chargerChat', quelConv);
    this.wsService.listen('maj').subscribe(() => {
      this.wsService.send('chargerChat', quelConv);
    });
    this.wsService.listen('chargerChatS').subscribe((arrayConv: any) => {
       this.convs = arrayConv;
      if(arrayConv === 'vide'){
        this.debutConv = true;
      }
      else{
        this.debutConv = false;
      }
    });
  }
  /////////////////////////////////////////////////////////////////////
  repondre(): void {
    let reponse = {
      quiestco: this.quiEstCo,
      interlocuteur: this.interlocuteur,
      auteur: this.quiEstCo,
      date: this.jour + '/' + (this.mois + 1) + '/' + this.annee,
      msg: this.repEnv
    }
    if (this.debutConv) {
      this.wsService.send('debuterChat', reponse);
      this.wsService.listen('repChatS').subscribe(() => {
        this.repEnv = "";
        this.wsService.send('chargerChat', reponse);
      });
    }
    else {
      this.wsService.send('repChat', reponse);
      this.wsService.listen('repChatS').subscribe(() => {
        this.repEnv = "";
        this.wsService.send('chargerChat', reponse);
      });
    }


  }
  //------------------------
  deco(){
    this.authService.deco();
  }

}
