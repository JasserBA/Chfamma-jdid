import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { PostDetailsComponent } from './posts/post-details/post-details.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AboutComponent } from './pages/about/about.component';
import { TermsPoliciesComponent } from './pages/terms-policies/terms-policies.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { ContactComponent } from './pages/contact/contact.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: "full" },
  { path: '**', component: PageNotFoundComponent },
  { path: 'details/:id', component: PostDetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'about', component: AboutComponent },
  { path: 'terms-policies', component: TermsPoliciesComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'contact', component: ContactComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
