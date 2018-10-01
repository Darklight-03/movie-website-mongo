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

  }

}
