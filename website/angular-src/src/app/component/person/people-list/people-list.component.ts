import { Component, OnInit } from '@angular/core';
import {Person} from '../../../model/person.model';
import {PersonService} from '../../../services/person.service';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.css']
})
export class PeopleListComponent implements OnInit {
  people: Person[]=[];

  constructor(private service: PersonService) { }

  ngOnInit() {
    this.service.getPopularPeople().subscribe((data: Object) => {
      for (let i = 0; i<10; i++) {
        this.people.push(new Person(data[i]['id'],data[i]['name'],data[i]['gender'],data[i]['profile_path'],data[i]['cast_movies'],data[i]['crew_movies'],"not found"));

      }
    });
  }

}
