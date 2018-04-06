import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
// Apollo
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpModule } from '@angular/http';

// GraphiQL: https://launchpad.graphql.com/1jzxrj179
const uri = 'http://localhost:5000/graphql';

@NgModule({
  exports: [
    HttpModule,
    HttpClientModule,
    ApolloModule,
    HttpLinkModule
  ]
})
export class GraphQLModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    // create Apollo
    apollo.create({
      link: httpLink.create({
        uri,
      }),
      cache: new InMemoryCache()
    });
  }
}
