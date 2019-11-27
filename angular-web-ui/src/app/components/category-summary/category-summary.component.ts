import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

import { Category, Quote, StockHistory, StockAllocation } from 'src/app/models/models';

@Component({
  selector: 'app-category-summary',
  templateUrl: './category-summary.component.html',
  styleUrls: ['./category-summary.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CategorySummaryComponent implements OnInit {
  // tslint:disable:variable-name
  _category: Category;
  _quotes: Quote[];
  _stockHistory: StockHistory[];
  // tslint:enable:variable-name

  @Input() edit: boolean;
  @Input() mode: string;

  get category(): Category { return this._category; }
  @Input() set category(value: Category) {
    this._category = value;
    this.setupMetrics();
  }

  get quotes(): Quote[] { return this._quotes; }
  @Input() set quotes(value: Quote[]) {
    this._quotes = value;
    this.setupMetrics();
  }

  get stockHistory(): StockHistory[] { return this._stockHistory; }
  @Input() set stockHistory(value: StockHistory[]) {
    this._stockHistory = value;
    this.setupMetrics();
  }


  categoryMetrics: { [name: string]: CategoryMetric } = {};
  stockMetrics: { [symbol: string]: StockMetric } = {};

  ngOnInit() {
  }

  setupMetrics() {
    if (!this._category || !this._quotes || !this._stockHistory) {
      return;
    }

    let totalCategoryValue = 0;

    this.stockMetrics = {};
    for (const stock of this.category.allStocks) {
      const stockHistory = this.stockHistory.find(sh => sh.symbol === stock.symbol);
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

      this.stockMetrics[stock.symbol] = {
        stock,
        stockHistory,
        currentPrice: quote.price,
        previousPrice,
        currentValue: stock.currentShares * quote.price,
        previousValue: stock.currentShares * previousPrice,
        percentChange: (quote.price / previousPrice - 1) * 100,
        percentOfCategory: undefined
      };

      totalCategoryValue += stock.currentShares * quote.price;
    }

    for (const symbol of this.category.allStocks.map(s => s.symbol)) {
      const metric = this.stockMetrics[symbol];
      metric.percentOfCategory = (metric.currentValue / totalCategoryValue) * 100;
    }

    if (!this.category.categories) {
      return;
    }

    this.categoryMetrics = {};
    for (const category of this.category.categories) {
      const categoryStocks = Object.values(this.stockMetrics).filter(sm => !!category.allStocks.find(s => s.symbol === sm.stock.symbol));

      const currentValue = categoryStocks.map(cs => cs.currentValue).reduce((v1, v2) => v1 + v2);
      const previousValue = categoryStocks.map(cs => cs.previousValue).reduce((v1, v2) => v1 + v2);
      const percentChange = (currentValue / previousValue - 1) * 100;

      this.categoryMetrics[category.name] = {
        category,
        currentValue,
        previousValue,
        percentChange,
        percentOfCategory: undefined
      };
    }

    for (const name of this.category.categories.map(s => s.name)) {
      const metric = this.categoryMetrics[name];
      metric.percentOfCategory = (metric.currentValue / totalCategoryValue) * 100;
    }
  }
}

export class Metric {
  currentValue: number;
  previousValue: number;
  percentChange: number;
  percentOfCategory: number;
}

export class StockMetric extends Metric {
  stock: StockAllocation;
  stockHistory: StockHistory;
  currentPrice: number;
  previousPrice: number;
}

export class CategoryMetric extends Metric {
  category: Category;
}
