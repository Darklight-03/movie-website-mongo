import { Component, OnInit } from '@angular/core';
import {MoviePoster} from '../../../model/moviePoster.model';
import {MovieService} from '../../services/movie.service';

@Component({
  selector: 'app-top-ten-movies',
  templateUrl: './top-ten-movies.component.html',
  styleUrls: ['./top-ten-movies.component.css'],
  providers: [MovieService]
})
export class TopTenMoviesComponent implements OnInit {

  topMovies: MoviePoster[] = [];

    constructor(private  listServ: MovieService) {}

  ngOnInit() {
      this.listServ.getMovie(2).subscribe((data: object) => {
        console.log(data);
      }) ;
  }
}
