/*
 Navicat Premium Data Transfer

 Source Server         : d8a157c0deff86364778e718a37a035e84cf271b98d14f57967614b443db27fd
 Source Server Type    : SQLite
 Source Server Version : 3035005
 Source Schema         : main

 Target Server Type    : SQLite
 Target Server Version : 3035005
 File Encoding         : 65001

 Date: 08/06/2025 11:09:34
*/

PRAGMA foreign_keys = false;

-- ----------------------------
-- Table structure for 1.21.x
-- ----------------------------
DROP TABLE IF EXISTS "1.21.x";
CREATE TABLE "1.21.x" (
  "version_all" TEXT NOT NULL,
  "version" TEXT DEFAULT NULL,
  "is_beta" INTEGER DEFAULT 0,
  "update_time" DATE DEFAULT NULL,
  "file_size" TEXT,
  "link" TEXT,
  PRIMARY KEY ("version_all")
);

-- ----------------------------
-- Records of 1.21.x
-- ----------------------------
INSERT INTO "1.21.x" VALUES ('1.21.1.0', '1.21.1', 0, '2025-06-01T16:00:00.000Z', '520MB', '{"123盘": {"ARMv7": "https://www.baidu.com/", "ARMv8": "https://www.baidu.com/"}, "OneDrive_E5": {"ARMv7": "https://www.baidu.com/", "ARMv8": "https://www.baidu.com/"}, "OneDrive_365": {"ARMv7": "https://www.baidu.com/", "ARMv8": "https://www.baidu.com/"}}');
INSERT INTO "1.21.x" VALUES ('1.21.1.3', '1.21.1.0', 1, '2025-06-01T16:00:00.000Z', '520MB', '{"123盘": {"ARMv7": "https://www.baidu.com/", "ARMv8": "https://www.baidu.com/"}, "OneDrive_E5": {"ARMv7": "https://www.baidu.com/", "ARMv8": "https://www.baidu.com/"}, "OneDrive_365": {"ARMv7": "https://www.baidu.com/", "ARMv8": "https://www.baidu.com/"}}');

-- ----------------------------
-- Table structure for larversion
-- ----------------------------
DROP TABLE IF EXISTS "larversion";
CREATE TABLE "larversion" (
  "Release" TEXT,
  "Beta" TEXT,
  "update_time" DATE,
  "version_all" TEXT
);

-- ----------------------------
-- Records of larversion
-- ----------------------------
INSERT INTO "larversion" VALUES ('1.21.x', '1.21.x', NULL, NULL);

-- ----------------------------
-- Table structure for last
-- ----------------------------
DROP TABLE IF EXISTS "last";
CREATE TABLE "last" (
  "version_all" TEXT NOT NULL,
  "version" TEXT DEFAULT NULL,
  "is_beta" INTEGER DEFAULT 0,
  "update_time" DATE DEFAULT NULL,
  "file_size" TEXT,
  "link" TEXT
);

-- ----------------------------
-- Records of last
-- ----------------------------
INSERT INTO "last" VALUES ('1.21.1.0', '1.21.1', 0, '2025-06-01T16:00:00.000Z', '520MB', '{"123盘": {"ARMv7": "https://www.baidu.com/", "ARMv8": "https://www.baidu.com/"}, "OneDrive_E5": {"ARMv7": "https://www.baidu.com/", "ARMv8": "https://www.baidu.com/"}, "OneDrive_365": {"ARMv7": "https://www.baidu.com/", "ARMv8": "https://www.baidu.com/"}}');
INSERT INTO "last" VALUES ('1.21.1.3', '1.21.1.0', 1, '2025-06-01T16:00:00.000Z', '520MB', '{"123盘": {"ARMv7": "https://www.baidu.com/", "ARMv8": "https://www.baidu.com/"}, "OneDrive_E5": {"ARMv7": "https://www.baidu.com/", "ARMv8": "https://www.baidu.com/"}, "OneDrive_365": {"ARMv7": "https://www.baidu.com/", "ARMv8": "https://www.baidu.com/"}}');

PRAGMA foreign_keys = true;
