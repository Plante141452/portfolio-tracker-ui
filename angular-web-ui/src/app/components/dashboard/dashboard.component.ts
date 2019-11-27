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
  valueChange: number;
  percentChange: number;

  edit: boolean;

  mode = 'W';

  constructor(private http: Http, private router: Router) {
  }

  ngOnInit() {
    this.update();
  }

  update() {
    this.getPortfolios();
  }

  save() {
    //eventually save
  }

  async rebalance() {
    const portfolioId = '5d80d0587d2d4657d8e1fe8f';
    const data = await this.http.get(`http://localhost/PortfolioTrackerApi/api/portfolios/${portfolioId}/rebalance`).toPromise();
    const results: any = data.json();
    const actions = results.actions.filter(d => d.amount > 1).map(d => {
      return {
        symbol: d.symbol,
        actionType: d.actionType,
        shares: d.amount,
        total: d.amount * this.quotes.find(q => q.symbol === d.symbol).price
      };
    });
    console.log(actions);
  }

  async getPortfolios() {
    const portfolioId = '5d80d0587d2d4657d8e1fe8f';
    const data = await this.http.get(`http://localhost/PortfolioTrackerApi/api/portfolios/${portfolioId}`).toPromise();

    this.portfolio = data.json();

    const quotes = await this.getQuotes();
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
      let previousPrice = 0;

      if (this.mode === 'W') {
        previousPrice = stockHistory.history[0].adjustedClose;
      } else if (this.mode === 'M') {
        const index = 3 > stockHistory.history.length ? stockHistory.history.length - 1 : 3;
        previousPrice = stockHistory.history[index].adjustedClose;
      } else {
        const index = 51 > stockHistory.history.length ? stockHistory.history.length - 1 : 51;
        previousPrice = stockHistory.history[index].adjustedClose;
      }

      this.currentValue += stock.currentShares * quote.price;
      previousValue += stock.currentShares * previousPrice;
    }

    this.valueChange = this.currentValue - previousValue;
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

