TRUNCATE TABLE sessions;

ALTER TABLE sessions
    ADD CONSTRAINT uc_sessions_userid UNIQUE (userId);

ALTER TABLE sessions
    DROP COLUMN id;

ALTER TABLE sessions
    ADD id VARCHAR(255) NOT NULL PRIMARY KEY;
