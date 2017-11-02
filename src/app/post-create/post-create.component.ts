import { PostService } from './../shared/services/post.service';
import { Component, OnInit, Input } from '@angular/core';

export class CreatePostForm {
  constructor(public title: string, public description: string) { }
}

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {

  model: CreatePostForm = new CreatePostForm('', '');
  message: string;

  constructor(private postService: PostService) { }

  ngOnInit() {
  }

  onSubmit() {
    this.postService.create(this.model);
    console.log(this.model);
  }
}
