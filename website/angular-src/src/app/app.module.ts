import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';


import { AppComponent } from './component/app.component';
import { PersonComponent } from './component/person/person.component';
import { MovieComponent } from './component/movie/movie.component';
import { MovieListComponent} from './component/movie/movie-list/movie-list.component';
import { PeopleListComponent} from './component/person/people-list/people-list.component';
import { TopTenMoviesComponent } from './component/movie/top-ten-movies/top-ten-movies.component';
import { AboutComponent } from './component/about/about.component';
import { MovieService } from './component/services/movie.service';
import { HeaderComponent } from './component/header/header.component';

const appRoutes: Routes = [
  {path: '', component: TopTenMoviesComponent},
  {path: 'people', component: PeopleListComponent},
  {path: 'person/:id', component: PersonComponent},
  {path: 'movie', component: MovieListComponent},
  {path: 'about', component: AboutComponent}

];

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
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule

  ],
  providers: [MovieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
