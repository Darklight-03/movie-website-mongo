import { Component, OnInit } from '@angular/core';
import {Person} from '../../model/person.model';
import {MovieService} from '../services/movie.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
   person: Person = new Person(0, '', 0, '', null, null, '');
  constructor(private dbService: MovieService) { }

  ngOnInit() {
    this.dbService.getPerson(1).subscribe((data: Object) => {
      console.log(data);
      console.log(Object.values(data)[3])


      this.person.id = Object.values(data)[3];
      this.person.name = Object.values(data)[6];
      this.person.gender = Object.values(data)[2];
      this.person.imagePath = Object.values(data)[7];
      this.person.castList = Object.values(data)[0];
      this.person.crewList = Object.values(data)[1];
      // need to put biograpy

      console.log(this.person);


    });
  }

}
