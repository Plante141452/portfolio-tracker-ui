import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-display-user-data',
  templateUrl: './display-user-data.component.html',
  styleUrls: ['./display-user-data.component.scss']
})

export class DisplayUserDataComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute) {

  }

  ngOnInit() {
  }

}
