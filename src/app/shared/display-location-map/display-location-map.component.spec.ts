import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayLocationMapComponent } from './display-location-map.component';

describe('DisplayLocationMapComponent', () => {
  let component: DisplayLocationMapComponent;
  let fixture: ComponentFixture<DisplayLocationMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayLocationMapComponent]
    });
    fixture = TestBed.createComponent(DisplayLocationMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
