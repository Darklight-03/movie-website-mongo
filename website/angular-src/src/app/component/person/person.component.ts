import { Component, OnInit } from '@angular/core';
import {Person} from '../../model/person.model';
import {ActivatedRoute} from '@angular/router';
import {PersonService} from '../../services/person.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
   person: Person = new Person(0, '', 0, '', null, null, '');
  constructor(private service: PersonService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.service.getPerson(this.route.snapshot.params['id']).subscribe((data: Object) => {
      console.log(data);

      this.person.id = data['id'];
      this.person.name = data['name'];
      this.person.gender = data['gender'];
      this.person.imagePath = data['profile_path'];
      this.person.castList = data['cast_movies'];
      this.person.crewList = data['crew_movies'];
    });
  }

  getGender(gender) {
    if (gender === 2) {
      return 'Male';
    } else {
      return 'Female';
    }
  }

}
