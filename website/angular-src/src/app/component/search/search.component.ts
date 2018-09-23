import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { Movie } from '../../model/movie.model';
import { Person } from '../../model/person.model';
import { SearchItem } from '../../model/search-item.model';
import { SearchResult } from '../../model/search-result.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  q:string;
  display:SearchResult[]=[];
  resultsPeople:SearchResult[]=[];
  resultsMovies:SearchResult[]=[];
  searching:boolean;
  notsearching:boolean;
  people:boolean;

  constructor(private route: ActivatedRoute, private dbService: MovieService) {
    route.params.subscribe(val => {  
      this.searching = true;
      this.notsearching = false;
      this.resultsPeople = [];
      this.resultsMovies = [];
      this.display = [];
      this.q = this.route.snapshot.params['q'];

      this.dbService.getSearchResults(this.q).subscribe((data: SearchItem) => {
        data.people.forEach((dataelem) => {
          this.resultsPeople.push(dataelem);
        });
        data.movies.forEach((dataelem) => {
          this.resultsMovies.push(dataelem);
        });
        // do something to let them know (SHOW BUTTONS) TODO
        this.searching = false;
        this.notsearching = true;
      });
    });
  }

  onClick($event){
    if($event.target.innerText == "People"){
      // show only people
      console.log(this.resultsPeople);
      console.log(this.display);
      this.display = this.resultsPeople;
      this.people = true;
    }else{
      //// show only movies
      console.log(this.resultsMovies);
      console.log(this.display);
      this.display = this.resultsMovies;
      this.people = false;
    }
  }
  ngOnInit() {
  }
}
