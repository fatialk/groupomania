import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnexionComponent } from './connexion/connexion.component';
import {AuthGuard} from "./services/auth-guard.service";
import {InscriptionComponent} from "./inscription/inscription.component";
import {PostComponent} from "./post-action/post.component";
import {ListComponent} from "./posts/list/list.component";
import {OneComponent} from "./posts/one/one.component";

const routes: Routes = [
  {path: 'inscription' , component: InscriptionComponent },
  {path: 'connexion' , component: ConnexionComponent},
  { path: 'post/:id/edit', component: PostComponent, canActivate: [AuthGuard] },
  { path: 'post/create', component: PostComponent, canActivate: [AuthGuard] },
  {path: 'list' , component: ListComponent, canActivate: [AuthGuard]},
  {path: 'post/:id' , component: OneComponent, canActivate: [AuthGuard]},

  { path: '', pathMatch: 'full', redirectTo: 'list'},
  { path: '**', redirectTo: 'list' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
