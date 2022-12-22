import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CoursesService } from "./courses.service";
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

describe('CoursesServices', () => {
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService],
    });

    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });
  it('should retrieve all courses', () => {
    coursesService.findAllCourses().subscribe((courses) => {
      expect(courses).toBeTruthy('No courses returned');
      expect(courses.length).toBe(12, 'incorrect number of courses');

      const course = courses.find(({ id }) => id === 12);

      expect(course.titles.description).toBe('Angular Testing Course');
    });

    const request = httpTestingController.expectOne('/api/courses');
    expect(request.request.method).toEqual('GET');

    request.flush({
      payload: Object.values(COURSES),
    });
  });

  it('should find a course by id', () => {
    coursesService.findCourseById(12).subscribe((course) => {
      expect(course).toBeTruthy('No courses returned');
      expect(course.id).toBe(12, 'incorrect id of course');
    });

    const request = httpTestingController.expectOne('/api/courses/12');
    expect(request.request.method).toEqual('GET');

    request.flush(COURSES[12]);
  });

  it('should save the course data', () => {
    const modifiedProperties: Partial<Course> = {
      titles: {
        description: 'Testing Course',
      },
    };
    coursesService.saveCourse(12, modifiedProperties).subscribe((course) => {
      expect(course.id).toBe(12);
    });

    const request = httpTestingController.expectOne('/api/courses/12');
    expect(request.request.method).toEqual('PUT');
    expect(request.request.body.titles.description).toEqual(modifiedProperties.titles.description);

    request.flush({
      ...COURSES[12],
      ...modifiedProperties,
    });
  });

  it('should give an error if saveCourse fails', () => {
    const modifiedProperties: Partial<Course> = {
      titles: {
        description: 'Testing Course',
      },
    };
    coursesService.saveCourse(12, modifiedProperties).subscribe(
      () => fail('the save course operation should have failed'),
      (err: HttpErrorResponse) => {
        expect(err.status).toBe(500);
      },
    );

    const request = httpTestingController.expectOne('/api/courses/12');
    expect(request.request.method).toEqual('PUT');

    request.flush('saveCourse failed', {
      status: 500,
      statusText: 'Internal Server Error',
    });
  });

  it('should find a list of lessons', () => {
    coursesService.findLessons(12).subscribe((lessons) => {
      expect(lessons).toBeTruthy();
      expect(lessons.length).toBe(3);
    });

    const request = httpTestingController.expectOne((req) => req.url.includes('/api/lessons'));

    expect(request.request.method).toEqual('GET');
    expect(request.request.params.get('courseId')).toEqual('12');
    expect(request.request.params.get('filter')).toEqual('');
    expect(request.request.params.get('sortOrder')).toEqual('asc');
    expect(request.request.params.get('pageNumber')).toEqual('0');
    expect(request.request.params.get('pageSize')).toEqual('3');

    request.flush({
      payload: findLessonsForCourse(12).slice(0, 3),
    });
  });
});
