import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(public route: ActivatedRoute) { }

  ngOnInit() {
    const searchString = this.route.snapshot.paramMap.get('searchString');
  }

}
