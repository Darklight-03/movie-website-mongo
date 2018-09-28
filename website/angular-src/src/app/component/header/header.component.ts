import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatAutocompleteModule} from '@angular/material/autocomplete';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router) { }
  ngOnInit() {

  }
  onKey($event) {
    if ($event.keyCode === 13) {
      const query = $event.target.value;
      this.router.navigate([`/search`, query]);
    }
  }
}
