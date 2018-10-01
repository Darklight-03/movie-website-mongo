import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {NetworkService} from '../../services/network.service';
import {debounceTime, switchMap, tap, finalize, distinctUntilChanged, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import { SearchResult } from '../../model/search-result.model';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userForm: FormGroup;
  isLoading = false;
  recommend: string[];
  autocompleted: SearchResult[]=[]; 

  constructor(private router: Router, private fb: FormBuilder, private service: NetworkService) { }
  ngOnInit() {
    this.userForm = this.fb.group({
      userInput: null
    });

    this.userForm
      .get('userInput')
      .valueChanges
      .pipe(
        debounceTime(200),
        tap(() => this.isLoading = true),
        switchMap(value => this.service.autoComplete(this.userForm.controls.userInput.value)
          .pipe(
            finalize(() => this.isLoading = false),
          )
        )
      )
      .subscribe()

  }
  onKey($event) {
    if ($event.keyCode === 13) {
      const query = $event.target.value;
      this.router.navigate([`/search`, query]);
    }
    else{
      this.service.autoComplete($event.target.value).subscribe((e: SearchResult[])=>{
        console.log(e);
        this.autocompleted = e;
        console.log(this.autocompleted);
      });
    }
  }
}
