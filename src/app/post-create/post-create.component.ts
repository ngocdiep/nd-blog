import { PostService } from './../shared/services/post.service';
import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../shared/models/message';

export class CreatePostForm {
  constructor(public headline: string, public body: string) { }
}

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {

  model: CreatePostForm = new CreatePostForm('', '');
  message: Message = new Message();

  constructor(private postService: PostService) { }

  ngOnInit() {
  }

  autogrow() {
    const textArea = document.getElementById('description');
    textArea.style.overflow = 'hidden';
    textArea.style.height = '0px';
    textArea.style.height = textArea.scrollHeight + 'px';
  }

  onSubmit() {
    this.postService.create(this.model).subscribe(
      result => {
        this.message.value = 'Created Successfully';
      });
  }
}
