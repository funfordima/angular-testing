import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoursesCardListComponent } from './courses-card-list.component';
import { CoursesModule } from '../courses.module';
import { COURSES } from '../../../../server/db-data';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { sortCoursesBySeqNo } from '../home/sort-course-by-seq';
import { Course } from '../model/course';
import { setupCourses } from '../common/setup-test-data';


describe('CoursesCardListComponent', () => {
  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let element: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CoursesModule],
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CoursesCardListComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;
      });
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });


  it("should display the course list", () => {
    component.courses = setupCourses();
    fixture.detectChanges();

    const cardList = element.queryAll(By.css('.course-card'));

    expect(cardList).toBeTruthy('Could not find cards');
    expect(cardList.length).toBe(12, 'Unexpected number of courses');
  });


  it("should display the first course", () => {
    component.courses = setupCourses();
    fixture.detectChanges();

    const course = component.courses[0];
    const card = element.query(By.css('.course-card:first-child'));
    const title = card.query(By.css('mat-card-title'));
    const image = card.query(By.css('img'));

    expect(card).toBeTruthy('Could not find a card');
    expect(title.nativeElement.textContent).toBe(course.titles.description);
    expect(image.nativeElement.src).toBe(course.iconUrl);
  });


});


