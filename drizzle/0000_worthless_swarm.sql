CREATE TABLE `authorized` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`fk_upload_id` integer NOT NULL,
	`by_session` text NOT NULL,
	`authorized_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`fk_upload_id` integer NOT NULL,
	`comment` text NOT NULL,
	`created_at` integer NOT NULL,
	`created_by_name` text NOT NULL,
	`created_by_session` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `uploads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`location` text NOT NULL,
	`mime_type` text NOT NULL,
	`size` integer NOT NULL,
	`created_at` integer NOT NULL,
	`created_by_name` text NOT NULL,
	`created_by_session` text NOT NULL
);
