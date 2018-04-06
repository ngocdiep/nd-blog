begin;


create schema nd;
create schema nd_private;

create table nd.user (
	id				serial primary key,
	first_name		text not null check (char_length(first_name) < 80),
	last_name		text check (char_length(last_name) < 80),
	about			text check (char_length(about) < 2048),
	avatar_url		text check (char_length(avatar_url) < 2048),
	created_at		timestamp default now()
);

comment on table nd.user is 'An user of the application.';
comment on column nd.user.id is 'The primary unique identifier for the user.';
comment on column nd.user.first_name is 'The user''s first name.';
comment on column nd.user.last_name is 'The user''s last name.';
comment on column nd.user.about is 'A short description about the user, written by the user.';
comment on column nd.user.avatar_url is 'The url to the user''s avatar.';
comment on column nd.user.created_at is 'The time this user was created.';

create table nd.post (
	id				serial primary key,
	author_id		integer not null references nd.user(id),
	headline		text not null check (char_length(headline) < 280),
	body			text,
	created_at		timestamp default now()
);

comment on table nd.post is 'A post written by an user.';
comment on column nd.post.id is 'The primary key for the post.';
comment on column nd.post.author_id is 'The id of the author.';
comment on column nd.post.headline is 'The title written by the user.';
comment on column nd.post.body is 'The main body written by the user.';
comment on column nd.post.created_at is 'The time this post was created.';

create function nd.user_full_name ("user" nd.user) returns text as $$
	select "user".first_name || ' ' || "user".last_name
$$ language sql stable;

comment on function nd.user_full_name(nd.user) is 'An user''s full name which is a concatenation of their first name and last name.';

create function nd.post_summary (
	post			nd.post,
	length			int default 50,
	omission		text default '...'
) returns text as $$
	select case
		when post.body is null then null
		else substr(post.body, 0, length) || omission
	end
$$ language sql stable;

comment on function nd.post_summary(nd.post, int, text) is 'A truncated version of the body for summaries.';

create function nd.user_latest_post("user" nd.user) returns nd.post as $$
	select post.*
	from nd.post as post
	where post.author_id = "user".id
	order by created_at desc
	limit 1
$$ language sql stable;

comment on function nd.user_latest_post(nd.user) is 'Get the latest post written by the user.';

create function nd.search_posts(search text) returns setof nd.post as $$
	select post.*
	from nd.post as post
	where post.headline ilike ('%' || search || '%') or post.body ilike ('%' || search || '%')
$$ language sql stable;

comment on function nd.search_posts(text) is 'Returns posts containing a given search term.';

alter table nd.user add column updated_at timestamp default now();
alter table nd.post add column updated_at timestamp default now();

create function nd_private.set_updated_at() returns trigger as $$
	begin
		new.updated_at := current_timestamp;
		return new;
	end;
$$ language plpgsql;

create trigger user_updated_at before update
	on nd.user
	for each row
	execute procedure nd_private.set_updated_at();
	
create trigger post_updated_at before update
	on nd.post
	for each row
	execute procedure nd_private.set_updated_at();
	
create table nd_private.user_account (
	user_id			integer primary key references nd.user(id) on delete cascade,
	email			text not null unique check (email ~* '^.+@.+\..+$'),
	password_hash	text not null
);

comment on table nd_private.user_account is 'Private information about an user''s account.';
comment on column nd_private.user_account.user_id is 'The id of the user associated with this account.';
comment on column nd_private.user_account.email is 'The email address of the user';
comment on column nd_private.user_account.password_hash is 'An opaque hash of the user''s password';

create extension if not exists "pgcrypto";

create function nd.register_user(
	first_name text,
	last_name text,
	email text,
	password text
) returns nd.user as $$
	declare
		"user" nd.user;
	begin
		insert into nd.user (first_name, last_name) values
			(first_name, last_name)
			returning * into "user";
		
		insert into nd_private.user_account (user_id, email, password_hash) values
			("user".id, email, crypt(password, gen_salt('bf')));
		
		return user;
	end;
$$ language plpgsql strict security definer;

comment on function nd.register_user(text, text, text, text) is 'Registers a single user and creates an account.';

create role nd_postgraphql login password 'xyz';

create role nd_anonymous;
grant nd_anonymous to nd_postgraphql;

create role nd_user;
grant nd_user to nd_postgraphql;

create type nd.jwt_token as (
	role text,
	user_id integer
);


create function nd.authenticate(
	email text,
	password text
) returns nd.jwt_token as $$
declare
	account nd_private.user_account;
begin
	select a.* into account
	from nd_private.user_account as a
	where a.email = $1;
	
	if account.password_hash = crypt(password, account.password_hash) then
		return ('nd_user', account.user_id)::nd.jwt_token;
	else
		return null;
	end if;
end;
$$ language plpgsql strict security definer;

comment on function nd.authenticate(text, text) is 'Creates a JWT token that will securely identify an user and given certain permissions.';

create function nd.current_user() returns nd.user as $$
	select *
	from nd.user
	where id = current_setting('jwt.claims.user_id')::integer
$$ language sql stable;

comment on function nd.current_user() is 'Gets the user who was identified by our JWT.';

grant usage on schema nd to nd_anonymous, nd_user;
grant select on table nd.user to nd_anonymous, nd_user;
grant update, delete on table nd.user to nd_user;

grant select on table nd.post to nd_anonymous, nd_user;
grant insert, update, delete on table nd.post to nd_user;
grant usage on sequence nd.post_id_seq to nd_user;

grant execute on function nd.user_full_name(nd.user) to nd_anonymous, nd_user;
grant execute on function nd.post_summary(nd.post, integer, text) to nd_anonymous, nd_user;
grant execute on function nd.user_latest_post(nd.user) to nd_anonymous, nd_user;
grant execute on function nd.search_posts(text) to nd_anonymous, nd_user;
grant execute on function nd.authenticate(text, text) to nd_anonymous, nd_user;
grant execute on function nd.current_user() to nd_anonymous, nd_user;

grant execute on function nd.register_user(text, text, text, text) to nd_anonymous;


alter table nd.user enable row level security;
alter table nd.post enable row level security;

create policy select_user on nd.user for select
	using(true);
	
create policy select_post on nd.post for select
	using(true);
	
create policy update_user on nd.user for update to nd_user
	using(id = current_setting('jwt.claims.user_id')::integer);

create policy delete_user on nd.user for delete to nd_user
	using(id = current_setting('jwt_claims.user_id')::integer);

create policy insert_post on nd.post for insert to nd_user
		with check (author_id = current_setting('jwt.claims.user_id')::integer);

create policy update_post on nd.post for update to nd_user
	using (author_id = current_setting('jwt.claims.user_id')::integer);
	
create policy delete_post on nd.post for delete to nd_user
	using(author_id = current_setting('jwt_claims.user_id')::integer);
	
commit;