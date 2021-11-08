import { Component, OnInit } from '@angular/core';
import { WsService } from 'src/app/services/ws.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss']
})
export class DiscussionComponent implements OnInit {

  constructor(
    private wsService: WsService,
    private authService: AuthService,
    private maRoute : ActivatedRoute
 
  ) { }
  quiEstCo: any;
  niveau:any;
  them:any;
  //them :any ; // dans l'url !! 
  discuX : any;
  reponse= '';
//////////////////////////////////////////////////////////////////////////////
  ngOnInit(): void {
    this.quiEstCo = this.authService.utilisateur.pseudo;
    this.niveau = this.authService.utilisateur.niveau;
    this.them = this.maRoute.snapshot.params.theme;
    this.wsService.send('chargerDiscussionX', this.them);
    this.wsService.listen('majDisc').subscribe(()=>{
      this.wsService.send('chargerDiscussionX', this.them);
    });
    this.wsService.listen('chargerDiscussionXS').subscribe((objetX:any)=>{
      this.discuX = objetX;
      console.log('qui est co: '+this.quiEstCo);
      for(let i=0; i<this.discuX.length; i++){
        if(this.discuX[i].auteur === this.quiEstCo){
      this.discuX[i].classe = "moi";
      console.log(i+'moi');
      }
      else{
        this.discuX[i].classe = '';
      }
      }
    });
  }
  ////////////////////////////////////////////////////////////////
ecrire(){
  let ecrire={
    theme: this.them,
    auteur: this.quiEstCo ,
    msg: this.reponse
  }
  this.wsService.send('ecrire', ecrire);
  this.wsService.listen('ecrireS').subscribe(()=>{
    this.reponse = '';
    this.wsService.send('chargerDiscussionX', this.them);
  })
}
/////***************************************** */
sure = false;
messaSuppr: any;
supprMsg(auteur:any, msg:any){
  this.sure = true;
  this.messaSuppr={
    theme: this.them,
    auteur: auteur,
    msg: msg
  }
}
  confirm() {
    this.wsService.send('supprMsg', this.messaSuppr);
    this.sure = false;
  }
  annul() {
    this.sure = false;
    console.log('ope annulée');
  }
  //////////////////////////////////////
  deco(){
    this.authService.deco();
  }
}
