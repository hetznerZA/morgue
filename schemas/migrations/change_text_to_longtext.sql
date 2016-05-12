ALTER TABLE postmortems MODIFY summary mediumtext NOT NULL;
ALTER TABLE postmortems MODIFY why_surprised longtext NOT NULL;
ALTER TABLE postmortems MODIFY goal longtext NOT NULL;
ALTER TABLE postmortems MODIFY rca longtext NOT NULL;
ALTER TABLE postmortems MODIFY counters longtext NOT NULL;
ALTER TABLE postmortems MODIFY plan longtext NOT NULL;
ALTER TABLE postmortems MODIFY followup longtext NOT NULL;
ALTER TABLE postmortems MODIFY gcal longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

