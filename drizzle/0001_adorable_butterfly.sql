CREATE TABLE `daily_stats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`date` text DEFAULT CURRENT_DATE,
	`water_intake` integer DEFAULT 0,
	`weight_recorded` real,
	`mood` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `exercise_library` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`muscle_group` text NOT NULL,
	`difficulty` text,
	`description` text,
	`video_url` text
);
--> statement-breakpoint
CREATE TABLE `nutrition_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`date` text DEFAULT CURRENT_DATE,
	`food_name` text NOT NULL,
	`meal_type` text,
	`calories` integer NOT NULL,
	`protein` real DEFAULT 0,
	`carbs` real DEFAULT 0,
	`fats` real DEFAULT 0,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `workout_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`date` text DEFAULT CURRENT_DATE,
	`exercise_id` integer,
	`sets` integer DEFAULT 3,
	`reps` integer DEFAULT 10,
	`weight_lifted` real,
	`duration_minutes` integer,
	`notes` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercise_library`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE `daily_logs`;--> statement-breakpoint
DROP TABLE `workouts`;--> statement-breakpoint
ALTER TABLE `users` ADD `full_name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `password` text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `created_at` text DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `users` ADD `height` real;--> statement-breakpoint
ALTER TABLE `users` ADD `gender` text;--> statement-breakpoint
ALTER TABLE `users` ADD `activity_level` text;--> statement-breakpoint
ALTER TABLE `users` ADD `daily_water_goal` integer DEFAULT 2500;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `name`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `goal_weight`;