-- Apple 로그인 계정 찾기 (data->>'appleSub')
create index if not exists users_apple_sub_idx on users ((data->>'appleSub'));
