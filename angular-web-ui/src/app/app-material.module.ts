import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
    imports: [MatButtonModule, MatCheckboxModule, MatExpansionModule, MatGridListModule],
    exports: [MatButtonModule, MatCheckboxModule, MatExpansionModule, MatGridListModule],
})
export class AppMaterialModule { }
