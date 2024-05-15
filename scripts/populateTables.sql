create extension if not exists "uuid-ossp";

drop table if exists cart_items;

drop table if exists products;

drop table if exists carts;

drop type if exists cartTypes;

create TYPE cartTypes AS ENUM ('OPEN', 'ORDERED');

create table carts (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null,
    created_at date not null,
    updated_at date not null,
    status cartTypes not null
);

create table products (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text not null,
    price integer not null
);

create table cart_items (
    id uuid primary key default uuid_generate_v4(),
    cart_id uuid,
    product_id uuid not null,
    count integer not null,
    foreign key ("cart_id") references "carts" ("id"),
    foreign key ("product_id") references "products" ("id")
);

insert into carts (id, user_id, created_at, updated_at, status) values 
    ('13178e8f-2057-4c7d-a638-229d45b25679', 'ad923738-f82d-4795-a2de-737bf5fb97b6', '2024-05-13 12:13:14', '2024-05-13 12:13:14', 'OPEN' ),
    ('d91bffa5-14c0-4d1b-abbb-aa087ae0e3a9', '7124dace-42ed-4a12-95d6-5c9d48f2c5a7', '2024-05-13 15:16:17', '2024-05-13 15:16:17', 'OPEN' ),
    ('fd14f42c-62ae-4e8c-b34d-212e2458d529', 'c6f0a034-4fbf-48e3-b2a3-d8653a70c4df', '2024-05-13 18:19:20', '2024-05-13 21:22:23', 'ORDERED');
   
insert into products (id, title, description, price) values 
    ('615ec073-2ebd-40eb-8cc4-7a7bf2bb6bb8', 'Product 1 title', 'Product 1 desciption', 100 ),
    ('2a689282-2c6e-4969-9fb9-010e7b7eb489', 'Product 2 title', 'Product 2 desciption', 200 ),
    ('e78fea3f-9c18-49f4-8057-edb61313bea0', 'Product 3 title', 'Product 3 desciption', 300 );

  
insert into cart_items (id, cart_id, product_id, count) values 
    ('934bc8fa-4a67-47dc-89f8-48b2c424781c', '13178e8f-2057-4c7d-a638-229d45b25679', '615ec073-2ebd-40eb-8cc4-7a7bf2bb6bb8', 1),
    ('26943ee2-c3a8-4ad4-a183-335d3f30cbfc', 'd91bffa5-14c0-4d1b-abbb-aa087ae0e3a9', '2a689282-2c6e-4969-9fb9-010e7b7eb489', 2),
    ('8bf0efc7-2d5a-4e9e-82d8-fe8ab1e5af99', 'fd14f42c-62ae-4e8c-b34d-212e2458d529', 'e78fea3f-9c18-49f4-8057-edb61313bea0', 2),
    ('8bf0efc7-2d5a-4e9e-82d8-fe8ab1e5af91', 'fd14f42c-62ae-4e8c-b34d-212e2458d529', '615ec073-2ebd-40eb-8cc4-7a7bf2bb6bb8', 3);