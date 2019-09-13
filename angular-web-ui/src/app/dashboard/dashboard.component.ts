import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';

import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  portfolios: any[] = [];

  constructor(private http: Http, private router: Router) {
  }

  ngOnInit() {
    this.http.get('http://localhost/PortfolioTrackerApi/api/users/1/portfolios').subscribe(data => {
      this.portfolios = data.json();
      //test
    }, error => {
      console.log('There was an error generating the proper GUID on the server', error);
    }, () => console.log('complete'));
  }
}

