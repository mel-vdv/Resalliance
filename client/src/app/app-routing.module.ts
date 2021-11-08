import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './components/accueil/accueil.component';
import { AdminComponent } from './components/admin/admin.component';
import { AmisComponent } from './components/amis/amis.component';
import { AproposComponent } from './components/apropos/apropos.component';
import { ChattComponent } from './components/chatt/chatt.component';
import { ChatttComponent} from './components/chattt/chattt.component';
import { ConnexionComponent } from './components/connexion/connexion.component';
import { DiscussionComponent } from './components/discussion/discussion.component';
import { EditerComponent } from './components/editer/editer.component';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { MdpComponent } from './components/mdp/mdp.component';
import { MembresComponent } from './components/membres/membres.component';
import { MessagerieComponent } from './components/messagerie/messagerie.component';
import { NewDiscussionComponent } from './components/new-discussion/new-discussion.component';
import { ProfilComponent } from './components/profil/profil.component';
import { ProfilMembreComponent } from './components/profilmembre/profilmembre.component';

const routes: Routes = [
  {path: "",
  component: AccueilComponent
  },
  {path: "apropos",
  component: AproposComponent
  },
  {path: "admin",
  component: AdminComponent
  },
  {path: "inscription",
  component: InscriptionComponent
  },
  {path: "connexion",
  component: ConnexionComponent
  },
  {path: "profil",
  component: ProfilComponent
  },
  {path: "profilmembre/:membreVisiteEnCours",
  component: ProfilMembreComponent
  },
  {path: "membres",
  component: MembresComponent
  },
  {path: "messagerie",
  component: MessagerieComponent
  },
  {path: "newDiscussion",
  component: NewDiscussionComponent
  },
  {path: "discussion/:theme",
  component: DiscussionComponent
  },
  {path: "chat",
  component: ChattComponent
  },
  {
    path: "chattt",
    component: ChatttComponent
  },
  {path: "editer",
  component: EditerComponent
  },
  {path: "mdp",
  component: MdpComponent
  },
  {path: "amis",
  component: AmisComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

constructor(
  private router: Router
){}

}

