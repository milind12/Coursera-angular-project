import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { Feedback } from '../shared/feedback';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  submitFeedback(feedback: Feedback): Observable<any> {
    return this.http.post(baseURL + 'feedback', feedback);
  }
  constructor(private http: HttpClient) {}
}
