import { Component, OnInit } from '@angular/core';
import {Person} from '../person.model';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.css']
})
export class PeopleListComponent implements OnInit {
  people: Person[] = [
    new Person(1, 'seungjin', 2,
      'https://static.gulfnews.com/polopoly_fs/1.2253644!/image/839283052.jpg_gen/derivatives/box_460346/839283052.jpg', 'he is..')
  ];

  constructor() { }

  ngOnInit() {
  }

}
