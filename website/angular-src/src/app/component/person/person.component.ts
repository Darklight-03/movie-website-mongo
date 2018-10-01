import { Component, OnInit } from '@angular/core';
import {Person} from '../../model/person.model';
import {ActivatedRoute} from '@angular/router';
import {NetworkService} from '../../services/network.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
  person: Person = new Person(0, '', 0, '', null, null, '');
  sort: string = "popularity";

  constructor(private service: NetworkService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.sort = 'popularity';
    this.service.getPerson(this.route.snapshot.params['id'], this.sort).subscribe((data: Object) => {
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

  changeSort(sort: any){
    this.sort = sort;
    this.person.castList = null;
    this.person.crewList = null;
    this.service.getPerson(this.route.snapshot.params['id'], this.sort).subscribe((data: Object) => {
      this.person.castList = data['cast_movies'];
      this.person.crewList = data['crew_movies'];
    });
  }

}
