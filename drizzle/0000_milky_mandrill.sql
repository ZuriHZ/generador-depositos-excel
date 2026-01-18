CREATE TABLE "deposits" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"fecha" varchar(10) NOT NULL,
	"numeroCuenta" varchar(50) NOT NULL,
	"nombreCliente" text NOT NULL,
	"monto" numeric(12, 2) NOT NULL,
	"tipoDeposito" varchar(50) NOT NULL,
	"remito" varchar(50),
	"numeroBolsa" varchar(50),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" text DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
--> statement-breakpoint
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;