-- Minicovery 초기 스키마. 문서는 data(jsonb)에, 조회용 값만 열로 둔다.
-- 앱 서버가 service role 키로만 접근하므로 RLS를 켜고 정책은 두지 않는다.

create table users (
  id text primary key,
  email text unique,
  data jsonb not null
);

create table courses (
  id text primary key,
  user_id text not null,
  status text not null,
  created_at timestamptz not null,
  data jsonb not null
);
create index courses_user_idx on courses (user_id);
create index courses_status_idx on courses (status);

create table drops (
  id text primary key,
  course_id text not null,
  user_id text not null,
  idx int not null,
  data jsonb not null
);
create index drops_course_idx on drops (course_id, idx);
create index drops_user_idx on drops (user_id);

create table usage_logs (id text primary key, user_id text not null, at timestamptz not null, data jsonb not null);
create index usage_at_idx on usage_logs (at);

create table events (id text primary key, user_id text not null, name text not null, at timestamptz not null, data jsonb not null);
create index events_at_idx on events (at);
create index events_name_idx on events (name);

create table reports (id text primary key, at timestamptz not null, data jsonb not null);
create table failures (id text primary key, at timestamptz not null, data jsonb not null);

alter table users enable row level security;
alter table courses enable row level security;
alter table drops enable row level security;
alter table usage_logs enable row level security;
alter table events enable row level security;
alter table reports enable row level security;
alter table failures enable row level security;

-- 임시 계정의 학습 기록을 가입 계정으로 옮긴다 (US-11)
create or replace function move_user_data(from_user text, to_user text) returns void
language sql as $$
  update courses set user_id = to_user, data = jsonb_set(data, '{userId}', to_jsonb(to_user)) where user_id = from_user;
  update drops set user_id = to_user, data = jsonb_set(data, '{userId}', to_jsonb(to_user)) where user_id = from_user;
  update events set user_id = to_user, data = jsonb_set(data, '{userId}', to_jsonb(to_user)) where user_id = from_user;
  update usage_logs set user_id = to_user, data = jsonb_set(data, '{userId}', to_jsonb(to_user)) where user_id = from_user;
$$;
