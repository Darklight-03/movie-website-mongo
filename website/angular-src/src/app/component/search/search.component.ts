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
  loadingmore:boolean;
  oftype:string;
  corrected:boolean;
  correction:string;

  constructor(private route: ActivatedRoute, private service: NetworkService) {
    // this runs every time the url parameters change
    route.params.subscribe(val => {  
      // clear all previous results
      this.searching = true;
      this.notsearching = false;
      this.corrected = false;
      this.display = [];
      this.q = this.route.snapshot.params['q'];
      // search database for new parameters
      this.service.getSearchResults(this.q, undefined, 20, 0).subscribe((data: SearchResult[]) => {
        console.log(data);
        data.forEach((dataelem) => {
          if(dataelem.q != dataelem.originalq){
            this.correction = dataelem.q;
            this.corrected = true;
          }
          this.display.push(dataelem);
        });
        this.searching = false;
        this.notsearching = true;
      })
    });
  }

  onClick($event){
    this.loadingmore = true;

    this.service.getSearchResults(this.q, undefined, 20, this.display.length).subscribe((data: SearchResult[]) => {
      console.log(data);
      data.forEach((dataelem) => {
        this.display.push(dataelem);
      });
      this.searching = false;
      this.notsearching = true;
      this.loadingmore = false;
    })


  }
  ngOnInit() {
  }
}
