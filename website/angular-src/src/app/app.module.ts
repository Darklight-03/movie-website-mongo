import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PersonComponent } from './person/person.component';
import { MovieComponent } from './movie/movie.component';
import { MovieListComponent} from './movie/movie-list/movie-list.component';
import { PeopleListComponent} from './person/people-list/people-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PersonComponent,
    MovieComponent,
    PeopleListComponent,
    MovieListComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
