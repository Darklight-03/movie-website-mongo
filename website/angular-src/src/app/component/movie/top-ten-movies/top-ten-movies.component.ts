import { Component, OnInit } from '@angular/core';
import {MoviePoster} from '../../../model/moviePoster.model';
import {MovieService} from '../../services/movie.service';

@Component({
  selector: 'app-top-ten-movies',
  templateUrl: './top-ten-movies.component.html',
  styleUrls: ['./top-ten-movies.component.css'],
})
export class TopTenMoviesComponent implements OnInit {

  topMovies: MoviePoster[] = [
    new MoviePoster(5, 'dssdlkasdlajdasldasldjasljdalsjdlasjdalsa', 'This is funny', 15,
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUKYsL-HsONvskWHVxg3YgwYKgp6aPzEOdench8tCnSxiBOpO1'),
    new MoviePoster(6, 'dssdlkasdlajdasldasldjasljdalsjdlasjdalsa', 'This is funny', 15,
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUKYsL-HsONvskWHVxg3YgwYKgp6aPzEOdench8tCnSxiBOpO1'),
    new MoviePoster(6, 'dssdlkasdlajdasldasldjasljdalsjdlasjdalsa', 'This is funny', 15,
      'https://www.vintagemovieposters.co.uk/wp-content/uploads/2016/04/IMG_1392.jpg'),
    new MoviePoster(6, 'dssdlkasdlajdasldasldjasljdalsjdlasjdalsa', 'This is funny', 15,
      'https://www.vintagemovieposters.co.uk/wp-content/uploads/2016/04/IMG_1392.jpg'),
    new MoviePoster(6, 'dssdlkasdlajdasldasldjasljdalsjdlasjdalsa', 'This is funny', 15,
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUKYsL-HsONvskWHVxg3YgwYKgp6aPzEOdench8tCnSxiBOpO1'),
    new MoviePoster(6, 'dssdlkasdlajdasldasldjasljdalsjdlasjdalsa', 'This is funny', 15,
      'https://www.vintagemovieposters.co.uk/wp-content/uploads/2016/04/IMG_1392.jpg'),
    new MoviePoster(6, 'dssdlkasdlajdasldasldjasljdalsjdlasjdalsa', 'This is funny', 15,
      'https://www.vintagemovieposters.co.uk/wp-content/uploads/2016/04/IMG_1392.jpg')

  ];

    constructor(private  listServ: MovieService) {}

  ngOnInit() {
       // this.listServ.getMovie(2).subscribe((data: object) => {
      // }) ;
  }
}
