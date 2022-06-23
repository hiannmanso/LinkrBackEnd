import db from "../db.js";

async function follow(follower, followed) {
    return await db.query(`INSERT INTO followers (following, followed) VALUES($1,$2)`, [follower, followed]);
}

async function verifyFollow(follower, followed) {
    return db.query(`SELECT * FROM followers WHERE following=$1 and followed=$2`, [follower, followed]);
}

async function unfollow(follower, followed) {
    return db.query(`DELETE FROM followers WHERE following=$1 and followed=$2`, [follower, followed]);
}

async function getUsersIFollow(id) {
    return db.query(`SELECT followed FROM followers WHERE following=$1`, [id]);
}

const followRepository = {
    follow,
    verifyFollow,
    unfollow,
    getUsersIFollow
};

export default followRepository;