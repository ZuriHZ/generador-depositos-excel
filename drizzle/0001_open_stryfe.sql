CREATE TABLE `deposits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fecha` varchar(10) NOT NULL,
	`numeroCuenta` varchar(50) NOT NULL,
	`nombreCliente` text NOT NULL,
	`monto` decimal(12,2) NOT NULL,
	`tipoDeposito` varchar(50) NOT NULL,
	`remito` varchar(50),
	`numeroBolsa` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `deposits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `deposits` ADD CONSTRAINT `deposits_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;