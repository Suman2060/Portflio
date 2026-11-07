ALTER TABLE "projects" ADD COLUMN "is_published" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "projects" ADD COLUMN "github_id" TEXT;
CREATE UNIQUE INDEX "projects_github_id_key" ON "projects"("github_id");
