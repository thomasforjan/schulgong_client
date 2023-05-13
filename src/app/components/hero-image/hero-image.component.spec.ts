import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HeroImageComponent} from './hero-image.component';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: April 2023
 * @description: Tests for reusable hero-images component
 */
describe('HeroImageComponent', () => {
  let component: HeroImageComponent;
  let fixture: ComponentFixture<HeroImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeroImageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HeroImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
