-- Caliber Asset Assessment Supabase Setup

create extension if not exists "pgcrypto";

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'submitted',

  property_name text not null,
  management_company text,
  owner_company text,
  brand text,
  property_city text,
  property_state text,

  contact_name text not null,
  contact_email text not null,
  contact_phone text,

  total_rooms integer not null,
  year_built integer,
  last_renovated_year integer,
  last_pm_year integer,
  average_occupancy text,
  rooms_out_of_order integer,

  rooms_available_per_day integer,
  floor_release_available boolean,
  materials_owner_supplied boolean,
  comp_rooms_available boolean,
  meals_provided boolean,
  preferred_work_schedule text,
  room_release_notes text,

  paint_score integer check (paint_score between 1 and 5),
  caulk_score integer check (caulk_score between 1 and 5),
  furniture_score integer check (furniture_score between 1 and 5),
  hvac_score integer check (hvac_score between 1 and 5),
  plumbing_score integer check (plumbing_score between 1 and 5),
  doors_score integer check (doors_score between 1 and 5),
  logistics_score integer check (logistics_score between 1 and 5),
  room_release_score integer check (room_release_score between 1 and 5),

  top_issues text[],
  notes text,

  readiness_score integer,
  recommended_program text,
  estimated_rooms_per_day numeric,
  recommended_pricing text,

  internal_notes text
);

create table if not exists public.assessment_files (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  assessment_id uuid references public.assessments(id) on delete cascade,
  file_label text,
  file_name text not null,
  file_path text not null,
  file_type text,
  file_size bigint
);

alter table public.assessments enable row level security;
alter table public.assessment_files enable row level security;

drop policy if exists "public can insert assessments" on public.assessments;
create policy "public can insert assessments"
on public.assessments
for insert
to anon
with check (true);

drop policy if exists "public can insert assessment files" on public.assessment_files;
create policy "public can insert assessment files"
on public.assessment_files
for insert
to anon
with check (true);

drop policy if exists "authenticated can read assessments" on public.assessments;
create policy "authenticated can read assessments"
on public.assessments
for select
to authenticated
using (true);

drop policy if exists "authenticated can update assessments" on public.assessments;
create policy "authenticated can update assessments"
on public.assessments
for update
to authenticated
using (true);

drop policy if exists "authenticated can read assessment files" on public.assessment_files;
create policy "authenticated can read assessment files"
on public.assessment_files
for select
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('assessment-media', 'assessment-media', false)
on conflict (id) do nothing;

drop policy if exists "public can upload assessment media" on storage.objects;
create policy "public can upload assessment media"
on storage.objects
for insert
to anon
with check (bucket_id = 'assessment-media');

drop policy if exists "authenticated can read assessment media" on storage.objects;
create policy "authenticated can read assessment media"
on storage.objects
for select
to authenticated
using (bucket_id = 'assessment-media');
