import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDocumnetDetailsComponent } from './view-documnet-details.component';

describe('ViewDocumnetDetailsComponent', () => {
  let component: ViewDocumnetDetailsComponent;
  let fixture: ComponentFixture<ViewDocumnetDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDocumnetDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDocumnetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
