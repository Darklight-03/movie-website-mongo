import { Component, OnInit } from '@angular/core';
import {Movie} from '../../../model/movie.model';
import {MovieService} from '../../services/movie.service';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];  

  constructor(private listServ: MovieService) { }

  ngOnInit() {
    this.listServ.getPopularMovies().subscribe((data: Object) => {
      for (let i = 0; i<10; i++) {
        this.movies.push(new Movie(data[i]['id'], data[i]['title'], null, null, null, data[i]['popularity'], data[i]['poster_path'], null, null, null));
      //console.log(data[i]);
      }
    });
  }

}
