import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
// Apollo
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink, HttpLinkHandler } from 'apollo-angular-link-http';
import { InMemoryCache, NormalizedCache } from 'apollo-cache-inmemory';

// GraphiQL: https://launchpad.graphql.com/1jzxrj179
// const uri = 'https://1jzxrj179.lp.gql.zone/graphql';
// const uri = 'https://api.graph.cool/simple/v1/cj5ge0gopwze40127slnlghfv';
const uri = '/graphql';
const uriExtra = 'https://1jzxrj179.lp.gql.zone/graphql';


@NgModule({
  exports: [
    HttpClientModule,
    ApolloModule,
    HttpLinkModule
  ]
})
export class GraphQLModule {
  cache: InMemoryCache;
  cacheExtra: InMemoryCache;
  link: HttpLinkHandler;
  linkExtra: HttpLinkHandler;

  constructor(
    private apollo: Apollo,
    private httpLink: HttpLink
  ) {
    this.cache = new InMemoryCache();
    this.link = this.httpLink.create({ uri, withCredentials: true });

    this.apollo.create({
      link: this.link,
      cache: this.cache,
    });


    this.cacheExtra = new InMemoryCache();
    this.linkExtra = this.httpLink.create({ uri: uriExtra });
    this.apollo.create({
      link: this.linkExtra,
      cache: this.cacheExtra,
    }, 'extra');

  }
}
