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

  currentValue: number;
  percentChange: number;

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

  async getPortfolios() {
    const portfolioId = '5d80d0587d2d4657d8e1fe8f';
    const data = await this.http.get(`http://localhost/PortfolioTrackerApi/api/portfolios/${portfolioId}`).toPromise();

    this.portfolio = data.json();

    const quotes = this.getQuotes();
    const history = this.getHistory();

    await quotes;
    await history;

    this.getPercentChange();
  }

  getPercentChange() {
    this.currentValue = 0;
    let previousValue = 0;

    for (const stock of this.portfolio.allStocks) {
      const stockHistory = this.history.find(h => h.symbol === stock.symbol);
      const quote = this.quotes.find(q => q.symbol === stock.symbol);
      const previousPrice = stockHistory.history[0].adjustedClose;

      this.currentValue += stock.currentShares * quote.price;
      previousValue += stock.currentShares * previousPrice;
    }

    this.percentChange = (this.currentValue / previousValue) - 1;
  }

  async getQuotes() {
    const symbols = this.portfolio.allStocks.map(s => s.symbol).filter((v, i, a) => a.indexOf(v) === i);
    const symbolsString = symbols.reduce((s1, s2) => `${s1},${s2}`);

    const data = await this.http.get(`http://localhost/PortfolioTrackerApi/api/quotes?symbols=${symbolsString}`).toPromise();
    this.quotes = data.json();
  }

  async getHistory() {
    const symbols = this.portfolio.allStocks.map(s => s.symbol).filter((v, i, a) => a.indexOf(v) === i);
    const symbolsString = symbols.reduce((s1, s2) => `${s1},${s2}`);

    const data = await this.http.get(`http://localhost/PortfolioTrackerApi/api/stocks?symbols=${symbolsString}`).toPromise();
    this.history = data.json();
  }
}

