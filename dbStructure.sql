create table public.abilities (
  onetsoc_code character(10) not null,
  element_id character varying(20) not null,
  scale_id character varying(3) not null,
  data_value numeric(5, 2) not null,
  n numeric null,
  standard_error numeric(7, 4) null,
  lower_ci_bound numeric(7, 4) null,
  upper_ci_bound numeric(7, 4) null,
  recommend_suppress character(1) null,
  not_relevant character(1) null,
  date_updated date not null,
  domain_source character varying(30) not null,
  constraint abilities_element_id_fkey foreign KEY (element_id) references content_model_reference (element_id),
  constraint abilities_onetsoc_code_fkey foreign KEY (onetsoc_code) references occupation_data (onetsoc_code),
  constraint abilities_scale_id_fkey foreign KEY (scale_id) references scales_reference (scale_id)
) TABLESPACE pg_default;

create index IF not exists idx_abilities_onetsoc_code on public.abilities using btree (onetsoc_code) TABLESPACE pg_default;


create table public.abilities_to_work_activities (
  abilities_element_id character varying(20) not null,
  work_activities_element_id character varying(20) not null,
  constraint abilities_to_work_activities_abilities_element_id_fkey foreign KEY (abilities_element_id) references content_model_reference (element_id),
  constraint abilities_to_work_activities_work_activities_element_id_fkey foreign KEY (work_activities_element_id) references content_model_reference (element_id)
) TABLESPACE pg_default;

create table public.abilities_to_work_context (
  abilities_element_id character varying(20) not null,
  work_context_element_id character varying(20) not null,
  constraint abilities_to_work_context_abilities_element_id_fkey foreign KEY (abilities_element_id) references content_model_reference (element_id),
  constraint abilities_to_work_context_work_context_element_id_fkey foreign KEY (work_context_element_id) references content_model_reference (element_id)
) TABLESPACE pg_default;

create table public.alternate_titles (
  onetsoc_code character(10) not null,
  alternate_title character varying(250) not null,
  short_title character varying(150) null,
  sources character varying(50) not null,
  constraint alternate_titles_onetsoc_code_fkey foreign KEY (onetsoc_code) references occupation_data (onetsoc_code)
) TABLESPACE pg_default;

create index IF not exists idx_alternate_titles_onetsoc_code on public.alternate_titles using btree (onetsoc_code) TABLESPACE pg_default;

create table public.basic_interests_to_riasec (
  basic_interests_element_id character varying(20) not null,
  riasec_element_id character varying(20) not null,
  constraint basic_interests_to_riasec_basic_interests_element_id_fkey foreign KEY (basic_interests_element_id) references content_model_reference (element_id),
  constraint basic_interests_to_riasec_riasec_element_id_fkey foreign KEY (riasec_element_id) references content_model_reference (element_id)
) TABLESPACE pg_default;

create table public.content_model_reference (
  element_id character varying(20) not null,
  element_name character varying(150) not null,
  description character varying(1500) not null,
  constraint content_model_reference_pkey primary key (element_id)
) TABLESPACE pg_default;

create table public.dwa_reference (
  element_id character varying(20) not null,
  iwa_id character varying(20) not null,
  dwa_id character varying(20) not null,
  dwa_title character varying(150) not null,
  constraint dwa_reference_pkey primary key (dwa_id),
  constraint dwa_reference_element_id_fkey foreign KEY (element_id) references content_model_reference (element_id),
  constraint dwa_reference_iwa_id_fkey foreign KEY (iwa_id) references iwa_reference (iwa_id)
) TABLESPACE pg_default;


create table public.education_training_experience (
  onetsoc_code character(10) not null,
  element_id character varying(20) not null,
  scale_id character varying(3) not null,
  category numeric null,
  data_value numeric(5, 2) not null,
  n numeric null,
  standard_error numeric(7, 4) null,
  lower_ci_bound numeric(7, 4) null,
  upper_ci_bound numeric(7, 4) null,
  recommend_suppress character(1) null,
  date_updated date not null,
  domain_source character varying(30) not null,
  constraint education_training_experience_element_id_fkey foreign KEY (element_id) references content_model_reference (element_id),
  constraint education_training_experience_element_id_scale_id_category_fkey foreign KEY (element_id, scale_id, category) references ete_categories (element_id, scale_id, category),
  constraint education_training_experience_onetsoc_code_fkey foreign KEY (onetsoc_code) references occupation_data (onetsoc_code),
  constraint education_training_experience_scale_id_fkey foreign KEY (scale_id) references scales_reference (scale_id)
) TABLESPACE pg_default;

create index IF not exists idx_education_training_experience_onetsoc_code on public.education_training_experience using btree (onetsoc_code) TABLESPACE pg_default;

create table public.emerging_tasks (
  onetsoc_code character(10) not null,
  task character varying(1000) not null,
  category character varying(8) not null,
  original_task_id numeric null,
  date_updated date not null,
  domain_source character varying(30) not null,
  constraint emerging_tasks_onetsoc_code_fkey foreign KEY (onetsoc_code) references occupation_data (onetsoc_code),
  constraint emerging_tasks_original_task_id_fkey foreign KEY (original_task_id) references task_statements (task_id)
) TABLESPACE pg_default;

create index IF not exists idx_emerging_tasks_onetsoc_code on public.emerging_tasks using btree (onetsoc_code) TABLESPACE pg_default;

create table public.ete_categories (
  element_id character varying(20) not null,
  scale_id character varying(3) not null,
  category numeric not null,
  category_description character varying(1000) not null,
  constraint ete_categories_pkey primary key (element_id, scale_id, category),
  constraint ete_categories_element_id_fkey foreign KEY (element_id) references content_model_reference (element_id),
  constraint ete_categories_scale_id_fkey foreign KEY (scale_id) references scales_reference (scale_id)
) TABLESPACE pg_default;

create table public.interests (
  onetsoc_code character(10) not null,
  element_id character varying(20) not null,
  scale_id character varying(3) not null,
  data_value numeric(5, 2) not null,
  date_updated date not null,
  domain_source character varying(30) not null,
  constraint interests_element_id_fkey foreign KEY (element_id) references content_model_reference (element_id),
  constraint interests_onetsoc_code_fkey foreign KEY (onetsoc_code) references occupation_data (onetsoc_code),
  constraint interests_scale_id_fkey foreign KEY (scale_id) references scales_reference (scale_id)
) TABLESPACE pg_default;

create index IF not exists idx_interests_onetsoc_code on public.interests using btree (onetsoc_code) TABLESPACE pg_default;

create table public.interests_illus_activities (
  element_id character varying(20) not null,
  interest_type character varying(20) not null,
  activity character varying(150) not null,
  constraint interests_illus_activities_element_id_fkey foreign KEY (element_id) references content_model_reference (element_id)
) TABLESPACE pg_default;

create table public.interests_illus_occupations (
  element_id character varying(20) not null,
  interest_type character varying(20) not null,
  onetsoc_code character(10) not null,
  constraint interests_illus_occupations_element_id_fkey foreign KEY (element_id) references content_model_reference (element_id),
  constraint interests_illus_occupations_onetsoc_code_fkey foreign KEY (onetsoc_code) references occupation_data (onetsoc_code)
) TABLESPACE pg_default;

create table public.iwa_reference (
  element_id character varying(20) not null,
  iwa_id character varying(20) not null,
  iwa_title character varying(150) not null,
  constraint iwa_reference_pkey primary key (iwa_id),
  constraint iwa_reference_element_id_fkey foreign KEY (element_id) references content_model_reference (element_id)
) TABLESPACE pg_default;

create table public.job_competency_scores (
  id serial not null,
  onetsoc_code character(10) not null,
  competency_name character varying(50) not null,
  score numeric(5, 2) not null,
  created_at timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint job_competency_scores_pkey primary key (id),
  constraint job_competency_scores_onetsoc_code_competency_name_key unique (onetsoc_code, competency_name),
  constraint job_competency_scores_onetsoc_code_fkey foreign KEY (onetsoc_code) references occupation_data (onetsoc_code)
) TABLESPACE pg_default;

create index IF not exists idx_job_competency_scores_code on public.job_competency_scores using btree (onetsoc_code) TABLESPACE pg_default;

create index IF not exists idx_job_competency_scores_competency on public.job_competency_scores using btree (competency_name) TABLESPACE pg_default;

create table public.job_major_mappings (
  id serial not null,
  onetsoc_code character(10) not null,
  major_name character varying(50) not null,
  match_score numeric(5, 2) not null,
  created_at timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint job_major_mappings_pkey primary key (id),
  constraint job_major_mappings_onetsoc_code_major_name_key unique (onetsoc_code, major_name),
  constraint job_major_mappings_onetsoc_code_fkey foreign KEY (onetsoc_code) references occupation_data (onetsoc_code)
) TABLESPACE pg_default;

create index IF not exists idx_job_major_mappings_code on public.job_major_mappings using btree (onetsoc_code) TABLESPACE pg_default;

create index IF not exists idx_job_major_mappings_major on public.job_major_mappings using btree (major_name) TABLESPACE pg_default;

create table public.job_nace_mappings (
  id serial not null,
  onetsoc_code character(10) not null,
  competency_1 character varying(50) not null,
  competency_1_score numeric(5, 2) not null,
  competency_2 character varying(50) not null,
  competency_2_score numeric(5, 2) not null,
  competency_3 character varying(50) not null,
  competency_3_score numeric(5, 2) not null,
  created_at timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint job_nace_mappings_pkey primary key (id),
  constraint job_nace_mappings_onetsoc_code_key unique (onetsoc_code),
  constraint job_nace_mappings_onetsoc_code_fkey foreign KEY (onetsoc_code) references occupation_data (onetsoc_code)
) TABLESPACE pg_default;

create index IF not exists idx_job_nace_mappings_code on public.job_nace_mappings using btree (onetsoc_code) TABLESPACE pg_default;create table public.job_nace_mappings (
  id serial not null,
  onetsoc_code character(10) not null,
  competency_1 character varying(50) not null,
  competency_1_score numeric(5, 2) not null,
  competency_2 character varying(50) not null,
  competency_2_score numeric(5, 2) not null,
  competency_3 character varying(50) not null,
  competency_3_score numeric(5, 2) not null,
  created_at timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint job_nace_mappings_pkey primary key (id),
  constraint job_nace_mappings_onetsoc_code_key unique (onetsoc_code),
  constraint job_nace_mappings_onetsoc_code_fkey foreign KEY (onetsoc_code) references occupation_data (onetsoc_code)
) TABLESPACE pg_default;

create index IF not exists idx_job_nace_mappings_code on public.job_nace_mappings using btree (onetsoc_code) TABLESPACE pg_default;

create table public.job_zone_reference (
  job_zone numeric not null,
  name character varying(50) not null,
  experience character varying(300) not null,
  education character varying(500) not null,
  job_training character varying(300) not null,
  examples character varying(500) not null,
  svp_range character varying(25) not null,
  constraint job_zone_reference_pkey primary key (job_zone)
) TABLESPACE pg_default;

create table public.job_zones (
  onetsoc_code character(10) not null,
  job_zone numeric not null,
  date_updated date not null,
  domain_source character varying(30) not null,
  constraint job_zones_job_zone_fkey foreign KEY (job_zone) references job_zone_reference (job_zone),
  constraint job_zones_onetsoc_code_fkey foreign KEY (onetsoc_code) references occupation_data (onetsoc_code)
) TABLESPACE pg_default;

create table public.knowledge (
  onetsoc_code character(10) not null,
  element_id character varying(20) not null,
  scale_id character varying(3) not null,
  data_value numeric(5, 2) not null,
  n numeric null,
  standard_error numeric(7, 4) null,
  lower_ci_bound numeric(7, 4) null,
  upper_ci_bound numeric(7, 4) null,
  recommend_suppress character(1) null,
  not_relevant character(1) null,
  date_updated date not null,
  domain_source character varying(30) not null,
  constraint knowledge_element_id_fkey foreign KEY (element_id) references content_model_reference (element_id),
  constraint knowledge_onetsoc_code_fkey foreign KEY (onetsoc_code) references occupation_data (onetsoc_code),
  constraint knowledge_scale_id_fkey foreign KEY (scale_id) references scales_reference (scale_id)
) TABLESPACE pg_default;

create index IF not exists idx_knowledge_onetsoc_code on public.knowledge using btree (onetsoc_code) TABLESPACE pg_default;

create table public.level_scale_anchors (
  element_id character varying(20) not null,
  scale_id character varying(3) not null,
  anchor_value numeric not null,
  anchor_description character varying(1000) not null,
  constraint level_scale_anchors_element_id_fkey foreign KEY (element_id) references content_model_reference (element_id),
  constraint level_scale_anchors_scale_id_fkey foreign KEY (scale_id) references scales_reference (scale_id)
) TABLESPACE pg_default;

create table public.occupation_data (
  onetsoc_code character(10) not null,
  title character varying(150) not null,
  description character varying(1000) not null,
  constraint occupation_data_pkey primary key (onetsoc_code)
) TABLESPACE pg_default;

create table public.occupation_level_metadata (
  onetsoc_code character(10) not null,
  item character varying(150) not null,
  response character varying(75) null,
  n numeric null,
  percent numeric(4, 1) null,
  date_updated date not null,
  constraint occupation_level_metadata_onetsoc_code_fkey foreign KEY (onetsoc_code) references occupation_data (onetsoc_code)
) TABLESPACE pg_default;

create table public.related_occupations (
  onetsoc_code character(10) not null,
  related_onetsoc_code character(10) not null,
  relatedness_tier character varying(50) not null,
  related_index numeric not null,
  constraint related_occupations_onetsoc_code_fkey foreign KEY (onetsoc_code) references occupation_data (onetsoc_code),
  constraint related_occupations_related_onetsoc_code_fkey foreign KEY (related_onetsoc_code) references occupation_data (onetsoc_code)
) TABLESPACE pg_default;

create index IF not exists idx_related_occupations_onetsoc_code on public.related_occupations using btree (onetsoc_code) TABLESPACE pg_default;


create table public.riasec_keywords (
  element_id character varying(20) not null,
  keyword character varying(150) not null,
  keyword_type character varying(20) not null,
  constraint riasec_keywords_element_id_fkey foreign KEY (element_id) references content_model_reference (element_id)
) TABLESPACE pg_default;

create table public.sample_of_reported_titles (
  onetsoc_code character(10) not null,
  reported_job_title character varying(150) not null,
  shown_in_my_next_move character(1) not null,
  constraint sample_of_reported_titles_onetsoc_code_fkey foreign KEY (onetsoc_code) references occupation_data (onetsoc_code)
) TABLESPACE pg_default;

create index IF not exists idx_sample_of_reported_titles_onetsoc_code on public.sample_of_reported_titles using btree (onetsoc_code) TABLESPACE pg_default;

create table public.scales_reference (
  scale_id character varying(3) not null,
  scale_name character varying(50) not null,
  minimum numeric not null,
  maximum numeric not null,
  constraint scales_reference_pkey primary key (scale_id)
) TABLESPACE pg_default;

create table public.skills (
  onetsoc_code character(10) not null,
  element_id character varying(20) not null,
  scale_id character varying(3) not null,
  data_value numeric(5, 2) not null,
  n numeric null,
  standard_error numeric(7, 4) null,
  lower_ci_bound numeric(7, 4) null,
  upper_ci_bound numeric(7, 4) null,
  recommend_suppress character(1) null,
  not_relevant character(1) null,
  date_updated date not null,
  domain_source character varying(30) not null,
  constraint skills_element_id_fkey foreign KEY (element_id) references content_model_reference (element_id),
  constraint skills_onetsoc_code_fkey foreign KEY (onetsoc_code) references occupation_data (onetsoc_code),
  constraint skills_scale_id_fkey foreign KEY (scale_id) references scales_reference (scale_id)
) TABLESPACE pg_default;

create index IF not exists idx_skills_onetsoc_code on public.skills using btree (onetsoc_code) TABLESPACE pg_default;

create table public.skills_to_work_activities (
  skills_element_id character varying(20) not null,
  work_activities_element_id character varying(20) not null,
  constraint skills_to_work_activities_skills_element_id_fkey foreign KEY (skills_element_id) references content_model_reference (element_id),
  constraint skills_to_work_activities_work_activities_element_id_fkey foreign KEY (work_activities_element_id) references content_model_reference (element_id)
) TABLESPACE pg_default;

create table public.skills_to_work_context (
  skills_element_id character varying(20) not null,
  work_context_element_id character varying(20) not null,
  constraint skills_to_work_context_skills_element_id_fkey foreign KEY (skills_element_id) references content_model_reference (element_id),
  constraint skills_to_work_context_work_context_element_id_fkey foreign KEY (work_context_element_id) references content_model_reference (element_id)
) TABLESPACE pg_default;

create table public.survey_booklet_locations (
  element_id character varying(20) not null,
  survey_item_number character varying(5) not null,
  scale_id character varying(3) not null,
  constraint survey_booklet_locations_element_id_fkey foreign KEY (element_id) references content_model_reference (element_id),
  constraint survey_booklet_locations_scale_id_fkey foreign KEY (scale_id) references scales_reference (scale_id)
) TABLESPACE pg_default;

create table public.task_categories (
  scale_id character varying(3) not null,
  category numeric not null,
  category_description character varying(1000) not null,
  constraint task_categories_pkey primary key (scale_id, category),
  constraint task_categories_scale_id_fkey foreign KEY (scale_id) references scales_reference (scale_id)
) TABLESPACE pg_default;

create table public.task_ratings (
  onetsoc_code character(10) not null,
  task_id numeric not null,
  scale_id character varying(3) not null,
  category numeric null,
  data_value numeric(5, 2) not null,
  n numeric null,
  standard_error numeric(7, 4) null,
  lower_ci_bound numeric(7, 4) null,
  upper_ci_bound numeric(7, 4) null,
  recommend_suppress character(1) null,
  date_updated date not null,
  domain_source character varying(30) not null,
  constraint task_ratings_onetsoc_code_fkey foreign KEY (onetsoc_code) references occupation_data (onetsoc_code),
  constraint task_ratings_scale_id_category_fkey foreign KEY (scale_id, category) references task_categories (scale_id, category),
  constraint task_ratings_scale_id_fkey foreign KEY (scale_id) references scales_reference (scale_id),
  constraint task_ratings_task_id_fkey foreign KEY (task_id) references task_statements (task_id)
) TABLESPACE pg_default;

create index IF not exists idx_task_ratings_onetsoc_code on public.task_ratings using btree (onetsoc_code) TABLESPACE pg_default;

create table public.task_statements (
  onetsoc_code character(10) not null,
  task_id numeric not null,
  task character varying(1000) not null,
  task_type character varying(12) null,
  incumbents_responding numeric null,
  date_updated date not null,
  domain_source character varying(30) not null,
  constraint task_statements_pkey primary key (task_id),
  constraint task_statements_onetsoc_code_fkey foreign KEY (onetsoc_code) references occupation_data (onetsoc_code)
) TABLESPACE pg_default;

create index IF not exists idx_task_statements_onetsoc_code on public.task_statements using btree (onetsoc_code) TABLESPACE pg_default;

create table public.tasks_to_dwas (
  onetsoc_code character(10) not null,
  task_id numeric not null,
  dwa_id character varying(20) not null,
  date_updated date not null,
  domain_source character varying(30) not null,
  constraint tasks_to_dwas_dwa_id_fkey foreign KEY (dwa_id) references dwa_reference (dwa_id),
  constraint tasks_to_dwas_onetsoc_code_fkey foreign KEY (onetsoc_code) references occupation_data (onetsoc_code),
  constraint tasks_to_dwas_task_id_fkey foreign KEY (task_id) references task_statements (task_id)
) TABLESPACE pg_default;

create table public.technology_skills (
  onetsoc_code character(10) not null,
  example character varying(150) not null,
  commodity_code numeric not null,
  hot_technology character(1) not null,
  in_demand character(1) not null,
  constraint technology_skills_commodity_code_fkey foreign KEY (commodity_code) references unspsc_reference (commodity_code),
  constraint technology_skills_onetsoc_code_fkey foreign KEY (onetsoc_code) references occupation_data (onetsoc_code)
) TABLESPACE pg_default;

create index IF not exists idx_technology_skills_onetsoc_code on public.technology_skills using btree (onetsoc_code) TABLESPACE pg_default;

create table public.tools_used (
  onetsoc_code character(10) not null,
  example character varying(150) not null,
  commodity_code numeric not null,
  constraint tools_used_commodity_code_fkey foreign KEY (commodity_code) references unspsc_reference (commodity_code),
  constraint tools_used_onetsoc_code_fkey foreign KEY (onetsoc_code) references occupation_data (onetsoc_code)
) TABLESPACE pg_default;

create index IF not exists idx_tools_used_onetsoc_code on public.tools_used using btree (onetsoc_code) TABLESPACE pg_default;

create table public.unspsc_reference (
  commodity_code numeric not null,
  commodity_title character varying(150) not null,
  class_code numeric not null,
  class_title character varying(150) not null,
  family_code numeric not null,
  family_title character varying(150) not null,
  segment_code numeric not null,
  segment_title character varying(150) not null,
  constraint unspsc_reference_pkey primary key (commodity_code)
) TABLESPACE pg_default;

create table public.work_activities (
  onetsoc_code character(10) not null,
  element_id character varying(20) not null,
  scale_id character varying(3) not null,
  data_value numeric(5, 2) not null,
  n numeric null,
  standard_error numeric(7, 4) null,
  lower_ci_bound numeric(7, 4) null,
  upper_ci_bound numeric(7, 4) null,
  recommend_suppress character(1) null,
  not_relevant character(1) null,
  date_updated date not null,
  domain_source character varying(30) not null,
  constraint work_activities_element_id_fkey foreign KEY (element_id) references content_model_reference (element_id),
  constraint work_activities_onetsoc_code_fkey foreign KEY (onetsoc_code) references occupation_data (onetsoc_code),
  constraint work_activities_scale_id_fkey foreign KEY (scale_id) references scales_reference (scale_id)
) TABLESPACE pg_default;

create index IF not exists idx_work_activities_onetsoc_code on public.work_activities using btree (onetsoc_code) TABLESPACE pg_default;


create table public.work_context (
  onetsoc_code character(10) not null,
  element_id character varying(20) not null,
  scale_id character varying(3) not null,
  category numeric null,
  data_value numeric(5, 2) not null,
  n numeric null,
  standard_error numeric(7, 4) null,
  lower_ci_bound numeric(7, 4) null,
  upper_ci_bound numeric(7, 4) null,
  recommend_suppress character(1) null,
  not_relevant character(1) null,
  date_updated date not null,
  domain_source character varying(30) not null,
  constraint work_context_element_id_fkey foreign KEY (element_id) references content_model_reference (element_id),
  constraint work_context_element_id_scale_id_category_fkey foreign KEY (element_id, scale_id, category) references work_context_categories (element_id, scale_id, category),
  constraint work_context_onetsoc_code_fkey foreign KEY (onetsoc_code) references occupation_data (onetsoc_code),
  constraint work_context_scale_id_fkey foreign KEY (scale_id) references scales_reference (scale_id)
) TABLESPACE pg_default;

create index IF not exists idx_work_context_onetsoc_code on public.work_context using btree (onetsoc_code) TABLESPACE pg_default;


create table public.work_context_categories (
  element_id character varying(20) not null,
  scale_id character varying(3) not null,
  category numeric not null,
  category_description character varying(1000) not null,
  constraint work_context_categories_pkey primary key (element_id, scale_id, category),
  constraint work_context_categories_element_id_fkey foreign KEY (element_id) references content_model_reference (element_id),
  constraint work_context_categories_scale_id_fkey foreign KEY (scale_id) references scales_reference (scale_id)
) TABLESPACE pg_default;


create table public.work_styles (
  onetsoc_code character(10) not null,
  element_id character varying(20) not null,
  scale_id character varying(3) not null,
  data_value numeric(5, 2) not null,
  n numeric null,
  standard_error numeric(7, 4) null,
  lower_ci_bound numeric(7, 4) null,
  upper_ci_bound numeric(7, 4) null,
  recommend_suppress character(1) null,
  date_updated date not null,
  domain_source character varying(30) not null,
  constraint work_styles_element_id_fkey foreign KEY (element_id) references content_model_reference (element_id),
  constraint work_styles_onetsoc_code_fkey foreign KEY (onetsoc_code) references occupation_data (onetsoc_code),
  constraint work_styles_scale_id_fkey foreign KEY (scale_id) references scales_reference (scale_id)
) TABLESPACE pg_default;

create index IF not exists idx_work_styles_onetsoc_code on public.work_styles using btree (onetsoc_code) TABLESPACE pg_default;

create table public.work_values (
  onetsoc_code character(10) not null,
  element_id character varying(20) not null,
  scale_id character varying(3) not null,
  data_value numeric(5, 2) not null,
  date_updated date not null,
  domain_source character varying(30) not null,
  constraint work_values_element_id_fkey foreign KEY (element_id) references content_model_reference (element_id),
  constraint work_values_onetsoc_code_fkey foreign KEY (onetsoc_code) references occupation_data (onetsoc_code),
  constraint work_values_scale_id_fkey foreign KEY (scale_id) references scales_reference (scale_id)
) TABLESPACE pg_default;

create index IF not exists idx_work_values_onetsoc_code on public.work_values using btree (onetsoc_code) TABLESPACE pg_default;

