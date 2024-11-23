import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableViewComponent } from './table-view/table-view.component';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@NgModule({
  declarations: [ 
    TableViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule
    
  ],
  exports: [TableViewComponent]
})
export class SharedModule { }
