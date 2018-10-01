import { Component, OnInit, Inject } from '@angular/core';
import {Movie} from '../../model/movie.model';
import {ActivatedRoute} from '@angular/router';
import {NetworkService} from '../../services/network.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {
  movie: Movie = new Movie(0, '', '', '', '', 0, '', null, null, '');
  first: boolean;
  sort: string = 'name';
  buttonText: string;

  constructor(private  service: NetworkService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.initi();
    this.sort = 'name';
    var userDet = this.service.getUserDetails();
    this.service.getUser(userDet['_id']).subscribe((data: Object) => {
      var found = false;
      for (var i = 0; (i < data['favorites'].length) && !found; i++) {
        found = data['favorites'][i]['id'] === this.movie.id;
      }
      if (found) {
        this.buttonText = 'Remove favorite';
      }
      else {
        this.buttonText = 'Add as favorite';
      }
    });

  }

  initi(){

    this.service.getMovie(this.route.snapshot.params['id'], this.sort).subscribe((data: Object) => {
      this.movie.id = data['id'];
      this.movie.title = data['title'];
      this.movie.original_language = data['original_language'];
      this.movie.release_date = data['release_date'];
      this.movie.overview = data['overview'];
      this.movie.posterPath = data['poster_path'];
      this.movie.popularity = data['popularity'];
      this.movie.castList = data['credits']['cast'];
      this.movie.crewList = data['credits']['crew'];
      this.movie.imdbLink = 'https://www.imdb.com/title/' + data['imdb_id'];

      console.log(this.movie.castList);


    });
  }

  onClick() {
    var userDet = this.service.getUserDetails();
    this.service.getUser(userDet['_id']).subscribe((data: Object) => {
      var found = false;
      for (var i = 0; (i < data['favorites'].length) && !found; i++) {
        found = data['favorites'][i]['id'] == this.movie.id;
      }
      if (found) {
        this.service.removeFavorite(userDet['_id'], this.movie.id).subscribe((data: Object) => {
          console.log(data);
          this.buttonText = "Add as favorite";
        },
        error => {
          console.log(error);
        });
      }
      else {
        this.service.addFavorite(userDet['_id'], this.movie.id).subscribe((data: Object) => {
          console.log(data);
          this.buttonText = "Remove favorite";
        },
        error => {
          console.log(error);
        });
      }
    });
  }

  changeSort(sort: any){
    this.sort = sort;
    this.movie.crewList = null;
    this.movie.castList = null;
    this.initi();
  }

}
