CREATE TABLE "User" (
	username varchar(16) PRIMARY KEY NOT NULL,
	password varchar(60) NOT NULL,
	first_name varchar(100) NOT NULL,
	last_name varchar(100) NOT NULL,
	position varchar(16)
);

ALTER TABLE "User"
	OWNER TO buzzbid;

CREATE SEQUENCE IF NOT EXISTS category_id_seq;

CREATE TABLE Category (
	category_id bigint PRIMARY KEY NOT NULL DEFAULT nextval('category_id_seq'),
	category varchar(16) NOT NULL
);

ALTER TABLE Category
	OWNER TO buzzbid;
	
INSERT INTO Category (category_id, category)
VALUES (nextval('category_id_seq'), 'Art'),
       (nextval('category_id_seq'), 'Book'),
       (nextval('category_id_seq'), 'Electronics'),
       (nextval('category_id_seq'), 'Home & Garden'),
       (nextval('category_id_seq'), 'Sporting Goods'),
       (nextval('category_id_seq'), 'Toys'),
       (nextval('category_id_seq'), 'Other');

CREATE SEQUENCE IF NOT EXISTS item_id_seq;

CREATE TABLE Item (
	item_id bigint PRIMARY KEY NOT NULL DEFAULT nextval('item_id_seq'),
	username varchar(16) NOT NULL REFERENCES "User" (username),
	item_name varchar(32) NOT NULL,
	description varchar(250) NOT NULL,
	is_returnable boolean NOT NULL DEFAULT FALSE,
	condition varchar(16) NOT NULL,
	category_id bigint NOT NULL REFERENCES Category (category_id)
);

ALTER TABLE Item
	OWNER TO buzzbid;

CREATE SEQUENCE IF NOT EXISTS auction_id_seq;

CREATE TABLE Auction (
	auction_id bigint PRIMARY KEY NOT NULL DEFAULT nextval('auction_id_seq'),
	item_id bigint NOT NULL REFERENCES Item (item_id),
	auction_end_time timestamp with time zone NOT NULL,
	auction_length bigint NOT NULL,
	get_it_now_price numeric(7, 2) NOT NULL,
	min_sale_price numeric(7, 2) NOT NULL,
	starting_bid numeric(7, 2) NOT NULL,
	cancel_reason varchar(250),
	cancelled_by varchar(16) REFERENCES "User" (username),
	winner varchar(16) REFERENCES "User" (username)
);

ALTER TABLE Auction
	OWNER TO buzzbid;

CREATE SEQUENCE IF NOT EXISTS bid_id_seq;

CREATE TABLE Bid (
	bid_id bigint PRIMARY KEY NOT NULL DEFAULT nextval('bid_id_seq'),
	auction_id bigint NOT NULL REFERENCES Auction (auction_id),
	username varchar(16) NOT NULL REFERENCES "User" (username),
	bid_amount numeric(7, 2) NOT NULL,
	bid_time timestamp with time zone
);

ALTER TABLE Bid
	OWNER TO buzzbid;

CREATE SEQUENCE IF NOT EXISTS rating_id_seq;

CREATE TABLE Rating (
	rating_id bigint PRIMARY KEY NOT NULL DEFAULT nextval('rating_id_seq'),
	item_id bigint NOT NULL REFERENCES Item (item_id),
    username varchar(16) NOT NULL REFERENCES "User" (username),
	number_of_stars bigint NOT NULL,
	comment varchar(250),
    rating_time timestamp with time zone NOT NULL
);

ALTER TABLE Rating
	OWNER TO buzzbid;