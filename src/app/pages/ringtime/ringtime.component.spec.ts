import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RingtimeComponent } from './ringtime.component';

describe('RingtimeComponent', () => {
  let component: RingtimeComponent;
  let fixture: ComponentFixture<RingtimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RingtimeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RingtimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
