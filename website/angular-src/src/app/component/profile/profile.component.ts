import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NetworkService} from '../../services/network.service';
import {UserDetails} from '../../services/network.service';
import {Movie} from '../../model/movie.model'
import {User} from '../../model/user.model'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User = new User(0, '', '', '');

  constructor(private service: NetworkService, private route: ActivatedRoute) {}

  ngOnInit() {
    var userDet = this.service.getUserDetails();


    // this.service.addFavorite(userDet['_id'], 862).subscribe((data: Object) => {
    //   console.log(data);
    // },
    // error => {
    //   console.log(error);
    // });

    this.service.getUser(userDet['_id']).subscribe((data: Object) => {
      console.log(data);
      this.user.id = data['id'];
      this.user.username = data['username'];
      this.user.favorites = data['favorites'];
      console.log(this.user.favorites);
    },
    error => {
      console.log(error);
    });

  }

}
