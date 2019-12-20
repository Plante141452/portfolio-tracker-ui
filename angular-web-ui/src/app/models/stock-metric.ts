import { Metric } from "./metric";

export class StockMetric extends Metric {
    symbol: string;
    currentPrice: number;
    previousPrice: number;
}
