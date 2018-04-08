import { Component, OnInit } from '@angular/core';
import { QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';
import { PostService } from '../core/services/post.service';
import { GetPostAllQueryResult, PostNode } from '../core/graphql/query';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  postsQueryRef: QueryRef<GetPostAllQueryResult>;
  posts: Observable<[PostNode]>;

  constructor(private postService: PostService) { }

  ngOnInit() {
    this.postsQueryRef = this.postService.getPostAll();

    this.posts = this.postsQueryRef.valueChanges.map(result => result.data.allPosts.edges);
  }

}
