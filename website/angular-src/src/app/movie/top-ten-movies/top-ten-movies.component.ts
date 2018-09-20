import { Component, OnInit } from '@angular/core';
import {MoviePoster} from '../moviePoster.model';

@Component({
  selector: 'app-top-ten-movies',
  templateUrl: './top-ten-movies.component.html',
  styleUrls: ['./top-ten-movies.component.css']
})
export class TopTenMoviesComponent implements OnInit {

  topMovies: MoviePoster[] = [
    new MoviePoster(1, 'SpiderMan', 'this is good movie', 5,
      'http://cdn.shopify.com/s/files/1/0170/5178/products/Spidey03.2_1024x1024.png?v=1513486916'),
    new MoviePoster(1, 'SpiderMan', 'this is good movie', 5,
      'http://cdn.shopify.com/s/files/1/0170/5178/products/Spidey03.2_1024x1024.png?v=1513486916'),
    new MoviePoster(1, 'SpiderMan', 'this is good movie', 5,
      'http://cdn.shopify.com/s/files/1/0170/5178/products/Spidey03.2_1024x1024.png?v=1513486916'),
    new MoviePoster(1, 'SpiderMan', 'this is good movie', 5,
      'http://cdn.shopify.com/s/files/1/0170/5178/products/Spidey03.2_1024x1024.png?v=1513486916'),
    new MoviePoster(1, 'SpiderMan', 'this is good movie', 5,
      'http://cdn.shopify.com/s/files/1/0170/5178/products/Spidey03.2_1024x1024.png?v=1513486916'),
    new MoviePoster(1, 'SpiderMan', 'this is good movie', 5,
      'http://cdn.shopify.com/s/files/1/0170/5178/products/Spidey03.2_1024x1024.png?v=1513486916')

  ];

    constructor() { }

  ngOnInit() {
  }

}
