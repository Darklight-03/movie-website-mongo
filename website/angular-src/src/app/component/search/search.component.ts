import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SearchItem } from '../../model/search-item.model';
import { SearchResult } from '../../model/search-result.model';
import {NetworkService} from '../../services/network.service';

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
  oftype:string;

  constructor(private route: ActivatedRoute, private service: NetworkService) {
    // this runs every time the url parameters change
    route.params.subscribe(val => {  
      // clear all previous results
      this.searching = true;
      this.notsearching = false;
      this.resultsPeople = [];
      this.resultsMovies = [];
      this.display = [];
      this.q = this.route.snapshot.params['q'];
      // search database for new parameters
      this.service.getSearchResults(this.q).subscribe((data: SearchItem) => {
        data.people.forEach((dataelem) => {
          this.resultsPeople.push(dataelem);
        });
        data.movies.forEach((dataelem) => {
          this.resultsMovies.push(dataelem);
        });
        this.searching = false;
        this.notsearching = true;
      })
      this.display = this.resultsMovies;
      this.people = false;
      this.oftype = "movie";
    });
  }

  onClick($event){
    if($event.target.innerText.includes("People")){
      // show only people
      this.display = this.resultsPeople;
      this.people = true;
      this.oftype = "person";
    }else{
      //// show only movies
      this.display = this.resultsMovies;
      this.people = false;
      this.oftype = "movie";
    }
  }
  ngOnInit() {
  }
}
