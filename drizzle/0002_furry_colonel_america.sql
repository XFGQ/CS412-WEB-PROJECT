DROP TABLE `daily_stats`;--> statement-breakpoint
DROP TABLE `exercise_library`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_workout_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`notes` text,
	`duration_minutes` integer,
	`weight_lifted` real,
	`sets` integer,
	`reps` integer,
	`date` text DEFAULT CURRENT_DATE,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_workout_logs`("id", "user_id", "notes", "duration_minutes", "weight_lifted", "sets", "reps", "date") SELECT "id", "user_id", "notes", "duration_minutes", "weight_lifted", "sets", "reps", "date" FROM `workout_logs`;--> statement-breakpoint
DROP TABLE `workout_logs`;--> statement-breakpoint
ALTER TABLE `__new_workout_logs` RENAME TO `workout_logs`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `users` ADD `age` integer;--> statement-breakpoint
ALTER TABLE `users` ADD `goal_weight` real;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `gender`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `activity_level`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `daily_water_goal`;