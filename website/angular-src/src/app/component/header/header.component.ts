import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NetworkService} from '../../services/network.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, startWith, switchMap} from 'rxjs/operators';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  searchTerm: FormControl = new FormControl();
  result = <any>[];






  constructor(private router: Router, private service: NetworkService, private fb: FormBuilder) {}




  ngOnInit() {
    this.searchTerm.valueChanges.subscribe(
      term => {
        if (term !== '') {
          this.service.search(term).subscribe(
            data => {
              this.result = data as any[];
            });
        }
      });


  }






  onKey($event) {
    if ($event.keyCode === 13) {
      const query = $event.target.value;
      this.router.navigate([`/search`, query]);
    }

  }



  }


