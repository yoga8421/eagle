import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-view-documnet-details',
  templateUrl: './view-documnet-details.component.html',
  styleUrls: ['./view-documnet-details.component.scss']
})
export class ViewDocumnetDetailsComponent implements OnInit {

  title:any;
   imageUrl:any;
  constructor( public dialogRef: MatDialogRef<ViewDocumnetDetailsComponent>,public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
      this.title = this.data?.title;
      this.imageUrl = this.data?.imageUrl;
  }
  close(){ this.dialogRef.close();}
}
