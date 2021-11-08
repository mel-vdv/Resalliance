import { NgForm } from '@angular/forms';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { WsService } from 'src/app/services/ws.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent implements OnInit {
  //******************************************************** */ 
  user: any = {
    pseudo: "",
    mdp: "",
    niveau: 2,
    statut: "deconnect",
    nom: "",
    prenom: "",
    date: "",
    genre: "",
    mail: "",
    description: "",
    tel: "",
    adresse: "",
    cp: "",
    ville: "",
    hobbies: [],
    confirmes: [],
    demandeurs: [],
    receveurs: [],
    chatEnCours:[],
    invitePar:[],
    demandeA:[],
    co:[]
  };

  message: any;
  visible = false;

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
    else { this.user.hobbies = this.user.hobbies.filter((hobbi: any) => hobbi !== "sport"); }
  }
  adrenaline = false;
  aadrenaline(etat: boolean) {
    this.adrenaline = etat;
    if (this.adrenaline) {
      this.user.hobbies.push("adrénaline");
    }
    else { this.user.hobbies = this.user.hobbies.filter((hobbi: any) => hobbi !== "adrénaline"); }
  }

  netflix = false;
  nnetflix(etat: boolean) {
    this.netflix = etat;
    if (this.netflix) {
      this.user.hobbies.push("netflix");
    }
    else { this.user.hobbies = this.user.hobbies.filter((hobbi: any) => hobbi !== "netflix"); }
  }

  musique = false;
  mmusique(etat: boolean) {
    this.musique = etat;
    if (this.musique) {
      this.user.hobbies.push("musique");
    }
    else { this.user.hobbies = this.user.hobbies.filter((hobbi: any) => hobbi !== "musique"); }
  }
  terrasse = false;
  tterrasse(etat: boolean) {
    this.terrasse = etat;
    if (this.terrasse) {
      this.user.hobbies.push("terrasse");
    }
    else { this.user.hobbies = this.user.hobbies.filter((hobbi: any) => hobbi !== "terrasse"); }
  }

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  constructor(
    private wsService: WsService,
    private http: HttpClient
  ) {
  }

  //********************************************************************** */
  ngOnInit(): void {

  }
  //************************************************************  alerte  + email  */
  valider(form: NgForm): void {
    //etape1 on verifie que pseudo pas déjà pris : 
    this.wsService.send('controlePseudo', this.user.pseudo);
    this.wsService.listen('controlePseudoS').subscribe((pseudoDejaPris: any) => {
      if (pseudoDejaPris) {
        this.message = "echec de l'inscription. Le pseudo choisi est déjà pris. Veuillez en choisir un autre.";
        this.visible = true;
      }
      else {
        //etape 2 si ok: 
        this.wsService.send('inscr', this.user);
        this.wsService.send('enregistrerPhoto', this.user.pseudo);
        this.wsService.listen("inscrS").subscribe(() => {
          this.message = "vous avez été inscrit avec succès";
          this.visible = true;
        });
        let email = {
          to: this.user.mail,
          subject: "confirmation d'inscription",
          text: "Bonjour " + this.user.pseudo + ". Votre inscription sur le réseau social RESALLIANCE a été effectuée avec succès. Bienvenue!"
        }
        this.wsService.send("envoiMail", email);
      }
    });
  }

  //-------------------------------
  // pour upload la photo : 
  envoyer() {

    const imageBlob = this.fileInput.nativeElement.files[0];
    const file = new FormData();
    file.set('file', imageBlob);
    
    this.http.post('http://localhost:1234/', file).subscribe(response => {
      console.log(response);
    });
   
    
  }
}

