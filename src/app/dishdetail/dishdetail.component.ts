import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormGroup, Form, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Comment } from '../shared/comment';
import { baseURL } from '../shared/baseurl';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
})
export class DishdetailComponent implements OnInit {
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  min = 0;
  max = 5;
  step = 1;
  baseurl = baseURL;
  comment: Comment | undefined;
  commentForm = this.fb.group({
    name: ['', Validators.minLength(2)],
    ratings: [0],
    comments: ['', Validators.required],
  });
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private dishService: DishService,
    private fb: FormBuilder
  ) {}
  errMess: string;
  onSubmit() {
    this.dishService.putDish(this.dish).subscribe(
      (dish) => {
        this.dish = dish;
      },
      (errmess) => {
        this.dish = null;
        this.errMess = <any>errmess;
      }
    );
    this.comment = undefined;
    this.commentForm.reset({ name: '', ratings: 0, comments: '' });
  }
  onValueChanged(formValue) {
    if (!this.comment) {
      this.comment = {
        rating: Number.parseInt(formValue.ratings) as number,
        comment: formValue.comments as string,
        author: formValue.name as string,
        date: Date.now().toString(),
      };
      this.dish.comments.push(this.comment);
    }
    const lastComment = this.dish.comments.length - 1;
    this.dish.comments[lastComment].author = formValue.name;
    this.dish.comments[lastComment].rating = formValue.ratings;
    this.dish.comments[lastComment].date = Date.now().toString();
    this.dish.comments[lastComment].comment = formValue.comments;
  }

  getComments(dish) {
    return dish.comments;
  }

  ngOnInit() {
    this.dishService
      .getDishIds()
      .subscribe((dishIds) => (this.dishIds = dishIds));
    this.route.params
      .pipe(
        switchMap((params: Params) => this.dishService.getDish(params['id']))
      )
      .subscribe((dish) => {
        this.dish = dish;
        this.setPrevNext(dish.id);
      });

    this.commentForm.valueChanges.subscribe((data) => {
      if (this.commentForm.valid) {
        this.onValueChanged(this.commentForm.value);
      } else {
        if (this.comment) {
          this.dish.comments.pop();
          this.comment = undefined;
        }
      }
    });
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[
      (this.dishIds.length + index - 1) % this.dishIds.length
    ];
    this.next = this.dishIds[
      (this.dishIds.length + index + 1) % this.dishIds.length
    ];
  }

  goBack() {
    this.location.back();
  }
}
