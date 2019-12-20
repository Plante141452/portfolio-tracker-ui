import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

import { Category, Quote, StockHistory, CategoryMetric } from 'src/app/models/models';
import { StockData } from '../stock-item/stock-item.component';
import { CadenceEnum } from '../dashboard/dashboard.component';

@Component({
  selector: 'category-summary',
  templateUrl: './category-summary.component.html',
  styleUrls: ['./category-summary.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CategorySummaryComponent implements OnInit {

  get category(): Category { return this._category; }
  @Input() set category(value: Category) {
    this._category = value;
    this.buildStockData();
  }

  get quotes(): Quote[] { return this._quotes; }
  @Input() set quotes(value: Quote[]) {
    this._quotes = value;
    this.buildStockData();
  }

  get stockHistory(): StockHistory[] { return this._stockHistory; }
  @Input() set stockHistory(value: StockHistory[]) {
    this._stockHistory = value;
    this.buildStockData();
  }

  get categoryStockData(): StockData[] {
    return this.stockData.filter(s1 => this.category.stocks && !!this.category.stocks.find(s2 => s1.stock.symbol === s2.symbol));
  }
  // tslint:disable:variable-name
  _category: Category;
  _quotes: Quote[];
  _stockHistory: StockHistory[];
  // tslint:enable:variable-name

  @Input() edit: boolean;
  @Input() cadence: CadenceEnum;

  categoryMetrics: { [name: string]: CategoryMetric } = {};
  stockData: StockData[] = [];

  buildStockData() {
    if (!this.category || !this.stockHistory || !this.quotes) {
      this.stockData = [];
      return;
    }

    this.stockData = !this.category.allStocks ? [] : this.category.allStocks.map(s => {
      const categoryStock = (this.category.stocks || []).find(s1 => s.symbol === s1.symbol) || s;
      return {
        stock: categoryStock,
        history: this.stockHistory.find(sh => sh.symbol === s.symbol),
        quote: this.quotes.find(q => q.symbol === s.symbol)
      } as StockData;
    });

    this.setupMetrics();
  }

  ngOnInit() {
  }

  setupMetrics() {
    if (!this._category || !this._quotes || !this._stockHistory) {
      return;
    }

    let totalCategoryValue = 0;

    for (const stockData of this.stockData) {
      const stock = stockData.stock;
      const stockHistory = stockData.history;
      const quote = stockData.quote;

      let previousPrice = 0;

      if (this.cadence === CadenceEnum.Weekly) {
        previousPrice = stockHistory.history[0].adjustedClose;
      } else if (this.cadence === CadenceEnum.Monthly) {
        const index = 3 > stockHistory.history.length ? stockHistory.history.length - 1 : 3;
        previousPrice = stockHistory.history[index].adjustedClose;
      } else if (this.cadence === CadenceEnum.Quarterly) {
        const index = 11 > stockHistory.history.length ? stockHistory.history.length - 1 : 11;
        previousPrice = stockHistory.history[index].adjustedClose;
      } else {
        const index = 51 > stockHistory.history.length ? stockHistory.history.length - 1 : 51;
        previousPrice = stockHistory.history[index].adjustedClose;
      }

      stockData.metric = {
        symbol: stock.symbol,
        currentPrice: quote.price,
        previousPrice,
        currentValue: stock.currentShares * quote.price,
        previousValue: stock.currentShares * previousPrice,
        percentChange: ((quote.price / previousPrice) - 1) * 100,
        percentOfCategory: undefined
      };

      totalCategoryValue += stock.currentShares * quote.price;
    }

    for (const stockData of this.stockData) {
      stockData.metric.percentOfCategory = (stockData.metric.currentValue / totalCategoryValue) * 100;
    }

    if (!this.category.categories) {
      return;
    }

    this.categoryMetrics = {};
    for (const category of this.category.categories) {
      const categoryStockMetrics = this.stockData.filter(sm => !!category.allStocks.find(s => s.symbol === sm.stock.symbol)).map(s => s.metric);

      const currentValue = categoryStockMetrics.length === 0 ? 1 : categoryStockMetrics.map(cs => cs.currentValue).reduce((v1, v2) => v1 + v2);
      const previousValue = categoryStockMetrics.length === 0 ? 1 : categoryStockMetrics.map(cs => cs.previousValue).reduce((v1, v2) => v1 + v2);

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
