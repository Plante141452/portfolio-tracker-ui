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
  portfolio: Portfolio;
  quotes: Quote[];
  history: StockHistory[];

  constructor(private http: Http, private router: Router) {
  }

  ngOnInit() {
    this.update();
  }

  update() {
    this.getPortfolios();
  }

  rebalance() {
    const portfolioId = '5d80d0587d2d4657d8e1fe8f';
    this.http.get(`http://localhost/PortfolioTrackerApi/api/portfolios/${portfolioId}/rebalance`).subscribe(data => {
      const results = data.json();
      console.log(results);
    }, error => {
      console.log('There was an error generating the proper GUID on the server', error);
    }, () => console.log('complete'));
  }

  getPortfolios() {
    const portfolioId = '5d80d0587d2d4657d8e1fe8f';
    this.http.get(`http://localhost/PortfolioTrackerApi/api/portfolios/${portfolioId}`).subscribe(data => {
      this.portfolio = data.json();

      this.getQuotes();
      this.getHistory();
    }, error => {
      console.log('There was an error generating the proper GUID on the server', error);
    }, () => console.log('complete'));
  }

  getQuotes() {
    const symbols = this.portfolio.allStocks.map(s => s.symbol).filter((v, i, a) => a.indexOf(v) === i);
    const symbolsString = symbols.reduce((s1, s2) => `${s1},${s2}`);

    this.http.get(`http://localhost/PortfolioTrackerApi/api/quotes?symbols=${symbolsString}`).subscribe(data => {
      this.quotes = data.json();
    }, error => {
      console.log('There was an error generating the proper GUID on the server', error);
    }, () => console.log('complete'));
  }

  getHistory() {
    const symbols = this.portfolio.allStocks.map(s => s.symbol).filter((v, i, a) => a.indexOf(v) === i);
    const symbolsString = symbols.reduce((s1, s2) => `${s1},${s2}`);

    this.http.get(`http://localhost/PortfolioTrackerApi/api/stocks?symbols=${symbolsString}`).subscribe(data => {
      this.history = data.json();
    }, error => {
      console.log('There was an error generating the proper GUID on the server', error);
    }, () => console.log('complete'));
  }
}

