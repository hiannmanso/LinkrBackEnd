CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    picture TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE sessions(
    id SERIAL PRIMARY KEY,
    "userID" INTEGER NOT NULL REFERENCES users(id),
    token TEXT UNIQUE NOT NULL
);

CREATE TABLE posts(
    id SERIAL PRIMARY KEY,
    "userID" INTEGER NOT NULL REFERENCES users(id),
    url TEXT NOT NULL,
    description TEXT,
    "urlDescription" TEXT,
    "urlTitle"  TEXT,
    "urlImage" TEXT,
    "quantityLikes" INTEGER DEFAULT 0
);

CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    "postID" INTEGER NOT NULL REFERENCES posts(id),
    "userID" INTEGER NOT NULL REFERENCES users(id)
);

CREATE TABLE hashtags(
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE hashtagsxposts(
    id SERIAL PRIMARY KEY,
    "postID" INTEGER NOT NULL REFERENCES posts(id),
    "hashtag" TEXT NOT NULL REFERENCES hashtags(name)
);
