import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';

import { Portfolio, Quote, StockHistory } from 'src/app/models/models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  portfolios: Portfolio[];
  quotes: Quote[];
  history: StockHistory[];

  constructor(private http: Http, private router: Router) {
  }

  ngOnInit() {
    this.http.get('http://localhost/PortfolioTrackerApi/api/users/1/portfolios').subscribe(data => {
      this.portfolios = data.json();

      this.getQuotes();
      this.getHistory();
    }, error => {
      console.log('There was an error generating the proper GUID on the server', error);
    }, () => console.log('complete'));
  }

  getQuotes() {
    const allPortfolioStocks = this.portfolios.map(p => p.allStocks).reduce((s1, s2) => [...s1, ...s2]);
    const symbols = allPortfolioStocks.map(s => s.symbol).filter((v, i, a) => a.indexOf(v) === i);
    const symbolsString = symbols.reduce((s1, s2) => `${s1},${s2}`);

    this.http.get(`http://localhost/PortfolioTrackerApi/api/quotes?symbols=${symbolsString}`).subscribe(data => {
      this.quotes = data.json();
    }, error => {
      console.log('There was an error generating the proper GUID on the server', error);
    }, () => console.log('complete'));
  }

  getHistory() {
    const allPortfolioStocks = this.portfolios.map(p => p.allStocks).reduce((s1, s2) => [...s1, ...s2]);
    const symbols = allPortfolioStocks.map(s => s.symbol).filter((v, i, a) => a.indexOf(v) === i);
    const symbolsString = symbols.reduce((s1, s2) => `${s1},${s2}`);

    this.http.get(`http://localhost/PortfolioTrackerApi/api/stocks?symbols=${symbolsString}`).subscribe(data => {
      this.history = data.json();
    }, error => {
      console.log('There was an error generating the proper GUID on the server', error);
    }, () => console.log('complete'));
  }
}

