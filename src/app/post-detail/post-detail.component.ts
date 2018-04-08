import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';
import { PostService } from '../core/services/post.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {

  postQueryRef: QueryRef<any>;
  post: Observable<any>;

  constructor(private route: ActivatedRoute, private postService: PostService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('post id: ' + id);
    this.postQueryRef = this.postService.getPostById(id);
    this.post = this.postQueryRef.valueChanges.map(rs => rs.data.postById);
  }

}
