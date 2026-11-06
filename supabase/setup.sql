create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  address text not null,
  city text not null,
  zip text not null,
  price integer not null check (price > 0),
  beds integer not null check (beds >= 0),
  baths numeric(4, 1) not null check (baths > 0),
  sqft integer not null check (sqft > 0),
  image text not null,
  image_path text,
  images text[] not null default '{}',
  image_paths text[] not null default '{}',
  pet_friendly boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.listings add column if not exists image_path text;
alter table public.listings add column if not exists images text[] not null default '{}';
alter table public.listings add column if not exists image_paths text[] not null default '{}';
update public.listings
set images = array[image]
where cardinality(images) = 0;
update public.listings
set image_paths = array[image_path]
where cardinality(image_paths) = 0 and image_path is not null;
alter table public.listings enable row level security;

grant select on public.listings to anon, authenticated;
grant insert, update, delete on public.listings to authenticated;

drop policy if exists "RentBridge public can read listings" on public.listings;
drop policy if exists "RentBridge admins can manage listings" on public.listings;
drop policy if exists "RentBridge only admins can insert listings" on public.listings;
drop policy if exists "RentBridge only admins can update listings" on public.listings;
drop policy if exists "RentBridge only admins can delete listings" on public.listings;

create policy "RentBridge public can read listings"
  on public.listings for select
  to anon, authenticated
  using (true);

create policy "RentBridge admins can manage listings"
  on public.listings for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "RentBridge only admins can insert listings"
  on public.listings as restrictive for insert
  to authenticated
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "RentBridge only admins can update listings"
  on public.listings as restrictive for update
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "RentBridge only admins can delete listings"
  on public.listings as restrictive for delete
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listing-images',
  'listing-images',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "RentBridge public can read listing images" on storage.objects;
drop policy if exists "RentBridge admins can upload listing images" on storage.objects;
drop policy if exists "RentBridge admins can update listing images" on storage.objects;
drop policy if exists "RentBridge admins can delete listing images" on storage.objects;
drop policy if exists "RentBridge only admins can insert listing images" on storage.objects;
drop policy if exists "RentBridge only admins can update listing images" on storage.objects;
drop policy if exists "RentBridge only admins can delete listing images" on storage.objects;

create policy "RentBridge public can read listing images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'listing-images');

create policy "RentBridge admins can upload listing images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'listing-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

create policy "RentBridge admins can update listing images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'listing-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  with check (
    bucket_id = 'listing-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

create policy "RentBridge admins can delete listing images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'listing-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

create policy "RentBridge only admins can insert listing images"
  on storage.objects as restrictive for insert
  to authenticated
  with check (
    bucket_id = 'listing-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

create policy "RentBridge only admins can update listing images"
  on storage.objects as restrictive for update
  to authenticated
  using (
    bucket_id = 'listing-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  with check (
    bucket_id = 'listing-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

create policy "RentBridge only admins can delete listing images"
  on storage.objects as restrictive for delete
  to authenticated
  using (
    bucket_id = 'listing-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- After creating the admin user in Supabase Auth, grant its role in the SQL editor:
-- update auth.users
-- set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
-- where email = 'your-admin-email@example.com';
