import { Component, OnInit , ElementRef, ViewChild} from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EditerService } from 'src/app/services/editer.service';
import { WsService } from 'src/app/services/ws.service';
import { HttpClient } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-editer',
  templateUrl: './editer.component.html',
  styleUrls: ['./editer.component.scss']
})
export class EditerComponent implements OnInit {

  
  @ViewChild('fileInput', { static: false}) fileInput!: ElementRef;


  constructor(
    private wsService: WsService,
    private editerService: EditerService,
    private authService: AuthService,
    private http : HttpClient
  ) { }
  ////////////////////////////////////////////////
  // variables importées:
  // user et adresse routerlink du bouton valider

  user: any;
  routerlink: any;

  ///////////////////////////////////////////////////
  ngOnInit(): void {

    if (this.editerService.pseudoDePageEnCours === this.authService.utilisateur.pseudo) {
      this.routerlink = "/profil";
    }
    else {
      this.routerlink = '/profilmembre/' + this.editerService.pseudoDePageEnCours ;
    }
      this.wsService.send('profil', this.editerService.pseudoDePageEnCours);
      this.wsService.listen('profilS').subscribe((profilObjet: any) => {
        this.user = JSON.parse(profilObjet);
      });
  }
  ////////////////////////////////////////////////
  editerPhoto = false;
  editerDescr = false;
  editerAdr = false;
  editerGenre = false;
  editerCp = false;
  editerHob = false;
  editerTel = false;
  editerMail = false;
  editerDate = false;
  editerHobbies=false;
  ////////////////////////////////////////////////
  editer(x: any) {
    switch (x) {
      case 'photo': if (this.editerPhoto) { this.editerPhoto = false; } else { this.editerPhoto = true; } break;
      case 'date': if (this.editerDate) { this.editerDate = false; } else { this.editerDate = true; } break;
      case 'adresse': if (this.editerAdr) { this.editerAdr = false; } else { this.editerAdr = true; } break;
      case 'description': if (this.editerDescr) { this.editerDescr = false } else { this.editerDescr = true; } break;
      case 'genre': if (this.editerGenre) { this.editerGenre = false; } else { this.editerGenre = true; } break;
      case 'cp': if (this.editerCp) { this.editerCp = false; } else { this.editerCp = true; } break;
      case 'hobbies': if (this.editerHob) { this.editerHob = false; } else { this.editerHob = true; } break;
      case 'tel': if (this.editerTel) { this.editerTel = false; } else { this.editerTel = true; } break;
      case 'mail': if (this.editerMail) { this.editerMail = false; } else { this.editerMail = true; } break;
      default: console.log('pb editer logo');
    }
  }
  //////////////////////////////////////////////
  validerChangement() {
    this.wsService.send('editer', this.user);
    this.wsService.send('enregistrerPhoto', this.user.pseudo);
  }
  
  //------------  UPLOAD LA PHOTO   -------------------
envoyer(){

// on envoie au serveur api l'image : 
  const imageBlob = this.fileInput.nativeElement.files[0];
  const file = new FormData();
  file.set('file', imageBlob);

  this.http.post('http://localhost:1234/', file).subscribe(response => {
  console.log(response);
 
  });
  

}
//--------------------------------------
couture = false;
ccouture(etat: boolean) {
  this.couture = etat;
  if (this.couture) {
    this.user.hobbies.push("couture");
  }
  else { this.user.hobbies = this.user.hobbies.filter((hobbi: any) => hobbi !== "couture"); }
}

sport = false;
ssport(etat: boolean): void {
  this.sport = etat;
  if (this.sport) {
    this.user.hobbies.push("sport");
  }
  else { this.user.hobbies = this.user.hobbies.filter((hobbi:any) => hobbi !== "sport"); }
}
adrenaline = false;
aadrenaline(etat: boolean) {
  this.adrenaline = etat;
  if (this.adrenaline) {
    this.user.hobbies.push("adrénaline");
  }
  else { this.user.hobbies = this.user.hobbies.filter((hobbi:any) => hobbi !== "adrénaline"); }
}

netflix = false;
nnetflix(etat: boolean) {
  this.netflix = etat;
  if (this.netflix) {
    this.user.hobbies.push("netflix");
  }
  else { this.user.hobbies = this.user.hobbies.filter((hobbi:any) => hobbi !== "netflix"); }
}

musique = false;
mmusique(etat: boolean) {
  this.musique = etat;
  if (this.musique) {
    this.user.hobbies.push("musique");
  }
  else { this.user.hobbies = this.user.hobbies.filter((hobbi:any) => hobbi !== "musique"); }
}
terrasse = false;
tterrasse(etat: boolean) {
  this.terrasse = etat;
  if (this.terrasse) {
    this.user.hobbies.push("terrasse");
  }
  else { this.user.hobbies = this.user.hobbies.filter((hobbi:any) => hobbi !== "terrasse"); }
}
///////////////////////////////

//////////////

deco(){
  this.authService.deco();
}
}
