import { Component, OnInit } from '@angular/core';
import { PostService, QueryAllPosts, Post } from '../shared/services/post.service';
import { QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  postsQueryRef: QueryRef<QueryAllPosts>;
  posts: Observable<[Post]>;

  constructor(private postService: PostService) { }

  ngOnInit() {
    this.postsQueryRef = this.postService.getPostAll();

    this.posts = this.postsQueryRef.valueChanges.map(result => result.data.allPosts.edges);
  }

}
