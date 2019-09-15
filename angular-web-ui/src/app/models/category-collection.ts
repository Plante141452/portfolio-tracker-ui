import { StockAllocation } from './stock-allocation';
import { Category } from './category';

export class CategoryCollection {
    categories: Category[];
    stocks: StockAllocation[];
    allStocks: StockAllocation[];
}
