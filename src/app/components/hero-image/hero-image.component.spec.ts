import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroImageComponent } from './hero-image.component';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.3
 * @since: April 2023
 * @description: Tests for reusable hero-images component
 */
/**
 * @description Test suite for the HeroImageComponent.
 * It includes tests for component creation and image display functionality.
 */
describe('HeroImageComponent', () => {
  let component: HeroImageComponent;
  let fixture: ComponentFixture<HeroImageComponent>;
  let imgElement: HTMLElement;

  /**
   * @description beforeEach block that sets up the testing environment.
   * The TestBed is configured with the HeroImageComponent.
   * The component instance is created and the initial change detection is triggered.
   * The image element from the template is queried.
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeroImageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    imgElement = fixture.nativeElement.querySelector('img');
  });

  /**
   * @description Test to check if the HeroImageComponent is created.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * @description Test to check if the image is displayed when imageUrl is provided.
   * The imageUrl of the component is set to a test URL.
   * The change detection is triggered.
   * The src attribute of the image element is expected to equal the test URL.
   */
  it('should display image when imageUrl is provided', () => {
    const testUrl =
      'https://moodle.fh-burgenland.at/pluginfile.php/1/core_admin/logo/0x200/1684231251/fh-burgenland-logo.png';
    component.imageUrl = testUrl;
    fixture.detectChanges();

    expect(imgElement.getAttribute('src')).toEqual(testUrl);
  });
});
