import { Component, OnInit, Input } from '@angular/core';

import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-category-summary',
  templateUrl: './category-summary.component.html',
  styleUrls: ['./category-summary.component.scss']
})
export class CategorySummaryComponent implements OnInit {
  @Input() category: Category;

  ngOnInit() {
  }

}
