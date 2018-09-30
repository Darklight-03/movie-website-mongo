import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {SocialLoginModule, AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, AuthService} from 'angular-6-social-login';


import { AppComponent } from './component/app.component';
import { PersonComponent } from './component/person/person.component';
import { MovieComponent } from './component/movie/movie.component';
import { MovieListComponent} from './component/movie/movie-list/movie-list.component';
import { PeopleListComponent} from './component/person/people-list/people-list.component';
import { TopTenMoviesComponent } from './component/movie/top-ten-movies/top-ten-movies.component';
import { AboutComponent } from './component/about/about.component';
import { HeaderComponent } from './component/header/header.component';
import { SearchComponent } from './component/search/search.component';
import { SignUpComponent } from './component/sign-up/sign-up.component';
import {AlertComponent} from './_directives/alert.component';

import {AlertService} from './services/alert.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LoginComponent } from './component/login/login.component';
import {NetworkService} from './services/network.service';

const appRoutes: Routes = [
  {path: '', component: TopTenMoviesComponent},
  {path: 'people', component: PeopleListComponent},
  {path: 'person/:id', component: PersonComponent},
  {path: 'search/:q', component: SearchComponent},
  {path: 'movies', component: MovieListComponent},
  {path: 'movie/:id', component: MovieComponent},
  {path: 'about', component: AboutComponent},
  {path: 'signup', component: SignUpComponent},
  {path: 'login', component: LoginComponent},
  {path: '**', component: TopTenMoviesComponent}

];

// Configs
export function getAuthServiceConfigs() {
  const config = new AuthServiceConfig(
    [
      {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider('Your-Facebook-app-id')
      },
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('318684240726-nahuka4eigdhe8i28qek3kgkjbkd8j74.apps.googleusercontent.com')
      }
    ]);
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    PersonComponent,
    PeopleListComponent,
    MovieComponent,
    MovieListComponent,
    TopTenMoviesComponent,
    AboutComponent,
    HeaderComponent,
    SearchComponent,
    SignUpComponent,
    AlertComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    CommonModule,
    SocialLoginModule,
    FormsModule,
    ReactiveFormsModule


  ],
  providers: [
    NetworkService,

    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    },
    AlertService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
