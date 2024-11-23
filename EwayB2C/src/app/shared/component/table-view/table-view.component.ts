import { Component, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
})
export class TableViewComponent {
  @Input() columns:any = [];
  @Input() values:any = [];
  @Input() actions:any = [];

  viewType = 'table';

  ngOnInit() {
  }
}
