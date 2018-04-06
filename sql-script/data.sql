select * from nd.user;
select nd.register_user('diep', 'nguyen ngoc', 'ngocdiep02tk@gmail.com', '123');

insert into nd.post(author_id, headline, body) values ('1', 'Why choose postgraphql?', 'Postgraphql gives us an easy way connect to a PostgreSQL database, automatically detecting primary keys, relationships, tables, types, and functions, that can then be queried using a GraphQL server.');