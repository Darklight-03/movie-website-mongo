import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';


import { AppComponent } from './app.component';
import { PersonComponent } from './person/person.component';
import { MovieComponent } from './movie/movie.component';
import { MovieListComponent} from './movie/movie-list/movie-list.component';
import { PeopleListComponent} from './person/people-list/people-list.component';
import { TopTenMoviesComponent } from './movie/top-ten-movies/top-ten-movies.component';
import { AboutComponent } from './about/about.component';
import { MovieService } from './services/movie.service';
import { HeaderComponent } from './header/header.component';

const appRoutes: Routes = [
  {path: '', component: TopTenMoviesComponent },
  {path: 'person', component: PeopleListComponent },
  {path: 'movie', component: MovieListComponent },
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
