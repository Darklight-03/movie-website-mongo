import { Component, OnInit } from '@angular/core';
import {Movie} from '../movie.model';

@Component({
  selector: 'app-top-ten-movies',
  templateUrl: './top-ten-movies.component.html',
  styleUrls: ['./top-ten-movies.component.css']
})
export class TopTenMoviesComponent implements OnInit {

  topMovies: Movie[] = [
    new Movie(1, 'SpiderMan',
      'http://cdn.shopify.com/s/files/1/0170/5178/products/Spidey03.2_1024x1024.png?v=1513486916',
      [1, 2, 3, 4, 5], [1, 2, 3, 4, 5]),
    new Movie(1, 'SpiderMan',
      'http://cdn.shopify.com/s/files/1/0170/5178/products/Spidey03.2_1024x1024.png?v=1513486916',
      [1, 2, 3, 4, 5], [1, 2, 3, 4, 5]),
    new Movie(1, 'SpiderMan',
      'http://cdn.shopify.com/s/files/1/0170/5178/products/Spidey03.2_1024x1024.png?v=1513486916',
      [1, 2, 3, 4, 5], [1, 2, 3, 4, 5]),
    new Movie(1, 'SpiderMan',
      'http://cdn.shopify.com/s/files/1/0170/5178/products/Spidey03.2_1024x1024.png?v=1513486916',
      [1, 2, 3, 4, 5], [1, 2, 3, 4, 5]),
    new Movie(1, 'SpiderMan',
      'http://cdn.shopify.com/s/files/1/0170/5178/products/Spidey03.2_1024x1024.png?v=1513486916',
      [1, 2, 3, 4, 5], [1, 2, 3, 4, 5]),
    new Movie(1, 'SpiderMan',
      'http://cdn.shopify.com/s/files/1/0170/5178/products/Spidey03.2_1024x1024.png?v=1513486916',
      [1, 2, 3, 4, 5], [1, 2, 3, 4, 5])

  ];

    constructor() { }

  ngOnInit() {
  }

}
