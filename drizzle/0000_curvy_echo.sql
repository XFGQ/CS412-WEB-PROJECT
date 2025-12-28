CREATE TABLE `daily_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`date` text NOT NULL,
	`steps` integer DEFAULT 0,
	`water_intake` real DEFAULT 0,
	`calories_consumed` integer DEFAULT 0,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`weight` real,
	`goal_weight` real,
	`daily_calorie_goal` integer DEFAULT 2000
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`type` text NOT NULL,
	`duration` integer NOT NULL,
	`calories_burned` integer,
	`date` text DEFAULT '2025-12-28T20:39:18.060Z',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
