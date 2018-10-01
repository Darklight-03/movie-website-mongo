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

  constructor(private  service: NetworkService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.initi();
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

  changeSort(sort: any){
    this.sort = sort;
    this.movie.crewList = null;
    this.movie.castList = null;
    this.initi();
  }

}
