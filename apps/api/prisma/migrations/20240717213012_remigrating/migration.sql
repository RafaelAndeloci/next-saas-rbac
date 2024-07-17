-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "avatar_url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "avatar_url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "avatar_url" DROP NOT NULL;
