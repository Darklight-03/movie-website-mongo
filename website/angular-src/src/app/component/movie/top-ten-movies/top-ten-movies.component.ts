import { Component, OnInit } from '@angular/core';
import {MoviePoster} from '../../../model/moviePoster.model';
import {MovieService} from '../../../services/movie.service';

@Component({
  selector: 'app-top-ten-movies',
  templateUrl: './top-ten-movies.component.html',
  styleUrls: ['./top-ten-movies.component.css'],
})
export class TopTenMoviesComponent implements OnInit {

  topMovies: MoviePoster[] = [];

    constructor(private  service: MovieService) {}

  ngOnInit() {

    this.service.getTopGrossing().subscribe((data: Object) => {
      console.log(data);
      for (let i = 0; i < 10; i++) {
        this.topMovies.push(new MoviePoster(data[i]['id'], data[i]['title'],
          data[i]['overview'], data[i]['popularity'], data[i]['poster_path']));
      }
      console.log(this.topMovies);
    });
  }
}
