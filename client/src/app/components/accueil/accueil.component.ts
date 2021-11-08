import { Component, OnInit } from '@angular/core';
import { WsService } from 'src/app/services/ws.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {
  constructor(
    private wsService: WsService
  ) { }
  nbMbTotal:any;
  nbMbConnect: any;
  nbComm:any;
  nbMsg: any;
  nbChat:any;
  choixVisible = false;
  src = "./../../../assets/connectVert.png";
  src2= "./../../../assets/question.png"
  ////////////////////////////////////////////////////
  ngOnInit(): void {
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
  }
  //////////////////////////////////////////////////////
  seConnecter(){
    this.choixVisible = true;
  }
  //// changement de logo quand la souris survole: 
  orange(){
    this.src= './../../../assets/deconnexionbis.png';
  }
  vert(){
    this.src = './../../../assets/connectVert.png';
  }
  clair(){
    this.src2 = './../../../assets/question2.png';
  }
  fonce(){
    this.src2 = './../../../assets/question.png';
  }
}
