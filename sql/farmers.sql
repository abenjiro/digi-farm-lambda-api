/*
 Navicat Premium Dump SQL

 Source Server         : postgres_local
 Source Server Type    : PostgreSQL
 Source Server Version : 170000 (170000)
 Source Host           : localhost:5432
 Source Catalog        : digi_farm
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 170000 (170000)
 File Encoding         : 65001

 Date: 10/03/2025 22:23:12
*/


-- ----------------------------
-- Table structure for farmers
-- ----------------------------
DROP TABLE IF EXISTS "public"."farmers";
CREATE TABLE "public"."farmers" (
  "id" int4 NOT NULL DEFAULT nextval('farmers_id_seq'::regclass),
  "user_id" int4 NOT NULL,
  "first_name" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "last_name" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "phone_number" varchar(15) COLLATE "pg_catalog"."default" NOT NULL,
  "location" varchar(100) COLLATE "pg_catalog"."default",
  "digital_location" point,
  "farm_size" numeric(10,2),
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;
ALTER TABLE "public"."farmers" OWNER TO "postgres";

-- ----------------------------
-- Uniques structure for table farmers
-- ----------------------------
ALTER TABLE "public"."farmers" ADD CONSTRAINT "farmers_user_id_key" UNIQUE ("user_id");
ALTER TABLE "public"."farmers" ADD CONSTRAINT "farmers_phone_number_key" UNIQUE ("phone_number");

-- ----------------------------
-- Primary Key structure for table farmers
-- ----------------------------
ALTER TABLE "public"."farmers" ADD CONSTRAINT "farmers_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table farmers
-- ----------------------------
ALTER TABLE "public"."farmers" ADD CONSTRAINT "farmers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
