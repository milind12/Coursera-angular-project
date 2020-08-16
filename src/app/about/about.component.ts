import { Component, OnInit } from '@angular/core';
import { LeaderService } from '../services/leader.service';
import { Leader } from '../shared/leader';
import { baseURL } from '../shared/baseurl';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  leaders: Leader[];
  constructor(private leaderService: LeaderService) {}

  imgBaseUrl = baseURL;
  ngOnInit(): void {
    this.leaderService.getLeaders().subscribe((leaders) => {
      this.leaders = leaders;
    });
  }
}
