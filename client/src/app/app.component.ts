
import { Component, OnInit  } from '@angular/core';
import { AuthService } from './services/auth.service';
//import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
//-----------------------------
export class AppComponent implements  OnInit {
     constructor(
    private authService : AuthService
  ) {
   }
//-----------------------------  
  logoDeconnexion:any;
  quiEstCo:any;
  //---------------------------
  ngOnInit():void {
    this.logoDeconnexion = this.authService.logoDeconnexionVisible;
    this.quiEstCo = this.authService.utilisateur.pseudo;
  }
//-------------------------------
deco(){
    this.authService.deco();
}
}