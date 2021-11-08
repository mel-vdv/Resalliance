import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccueilComponent } from './components/accueil/accueil.component';
import { ProfilComponent } from './components/profil/profil.component';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { ConnexionComponent } from './components/connexion/connexion.component';
import { MessagerieComponent } from './components/messagerie/messagerie.component';
import { AproposComponent } from './components/apropos/apropos.component';
import { MembresComponent } from './components/membres/membres.component';
import { ProfilMembreComponent } from './components/profilmembre/profilmembre.component';
import { MdpComponent } from './components/mdp/mdp.component';
import { ChattComponent } from './components/chatt/chatt.component';
import { AmisComponent } from './components/amis/amis.component';
import { EditerComponent } from './components/editer/editer.component';
import { AlerteComponent } from './components/alerte/alerte.component';
import { RecoComponent } from './components/reco/reco.component';
import { ChatttComponent } from './components/chattt/chattt.component';
import { BoiteComponent } from './components/boite/boite.component';
import { NewDiscussionComponent } from './components/new-discussion/new-discussion.component';
import { DiscussionComponent } from './components/discussion/discussion.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './components/admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    ProfilComponent,
    InscriptionComponent,
    ConnexionComponent,
    MessagerieComponent,
    ChattComponent,
    AproposComponent,
    MembresComponent,
    ProfilMembreComponent,
    MdpComponent,
    ChattComponent,
    AmisComponent,
    EditerComponent,
    AlerteComponent,
    RecoComponent,
    ChatttComponent,
    BoiteComponent,
    NewDiscussionComponent,
    DiscussionComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
