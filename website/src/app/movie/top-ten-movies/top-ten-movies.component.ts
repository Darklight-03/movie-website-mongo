import { Component, OnInit } from '@angular/core';
import {Movie} from '../movie.model';

@Component({
  selector: 'app-top-ten-movies',
  templateUrl: './top-ten-movies.component.html',
  styleUrls: ['./top-ten-movies.component.css']
})
export class TopTenMoviesComponent implements OnInit {
  movies: Movie[] = [];
  constructor() { }

  ngOnInit() {
  }

}
