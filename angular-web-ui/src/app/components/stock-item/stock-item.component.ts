import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { StockAllocation, Quote, StockMetric, StockHistory } from 'src/app/models/models';


export interface StockData {
  stock: StockAllocation,
  quote: Quote,
  metric: StockMetric,
  history: StockHistory
}

@Component({
  selector: 'stock-item',
  templateUrl: './stock-item.component.html',
  styleUrls: ['./stock-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StockItemComponent implements OnInit {
  // tslint:disable:variable-name
  _stockData: StockData;

  // tslint:enable:variable-name

  @Input() edit: boolean;
  @Input() mode: string;

  get stockData(): StockData { return this._stockData; }
  @Input() set stockData(value: StockData) {
    this._stockData = value;
  }

  ngOnInit() {
  }
}
