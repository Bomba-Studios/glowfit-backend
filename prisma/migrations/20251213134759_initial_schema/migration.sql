-- AlterTable
ALTER TABLE "users" ADD COLUMN     "date_of_birth" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "goal_id" INTEGER,
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "weight" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "days_of_week" (
    "id" INTEGER NOT NULL,
    "name_en" VARCHAR(10) NOT NULL,
    "name_es" VARCHAR(10) NOT NULL,
    "short_name" VARCHAR(3) NOT NULL,

    CONSTRAINT "days_of_week_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routine_days" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "routine_id" UUID,
    "day_id" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "routine_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routine_exercises" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "routine_id" UUID,
    "exercise_id" UUID,
    "order_position" INTEGER NOT NULL,
    "sets" INTEGER,
    "reps" INTEGER,
    "weight" DECIMAL(10,2),
    "rest_time" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "routine_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routines" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "user_id" UUID NOT NULL,
    "estimated_duration" INTEGER,
    "level" VARCHAR(50),
    "goal" VARCHAR(50),
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "routines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goals" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "routine_days_routine_id_day_id_key" ON "routine_days"("routine_id", "day_id");

-- CreateIndex
CREATE UNIQUE INDEX "goals_name_key" ON "goals"("name");

-- CreateIndex
CREATE INDEX "idx_users_goal_id" ON "users"("goal_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "fk_users_goal" FOREIGN KEY ("goal_id") REFERENCES "goals"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "routine_days" ADD CONSTRAINT "routine_days_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "days_of_week"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "routine_days" ADD CONSTRAINT "routine_days_routine_id_fkey" FOREIGN KEY ("routine_id") REFERENCES "routines"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "routine_exercises" ADD CONSTRAINT "routine_exercises_routine_id_fkey" FOREIGN KEY ("routine_id") REFERENCES "routines"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
