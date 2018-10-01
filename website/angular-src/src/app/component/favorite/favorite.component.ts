import { Component, OnInit } from '@angular/core';
import {NetworkService} from '../../services/network.service';
import {Movie} from '../../model/movie.model';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {
  movies: Movie[] = [];

  constructor(private service: NetworkService) { }

  ngOnInit() {
    this.service.getFavorite(this.service.getUserDetails().id).subscribe((movies: Object) => {
      let i = 0;
      while (movies[i]) {
        this.movies.push(new Movie(movies[i]['id'], movies[i]['title'], null, null, null, 0, movies[i]['poster_path'], null, null, null ));
        i++;
      }
    });

  }

}
