'use strict';

const db = require('../database');
const groups = require('.');
const privileges = require('../privileges');
const posts = require('../posts');

module.exports = function (Groups) {
    Groups.onNewPostMade = async function (postData) {
        if (!parseInt(postData.uid, 10)) {
            return;
        }

        let groupNames = await Groups.getUserGroupMembership('groups:visible:createtime', [postData.uid]);
//        console.log("GROUPNAMES");
//        console.log(groupNames);
        groupNames = groupNames[0];

        // Only process those groups that have the cid in its memberPostCids setting (or no setting at all)
        const groupData = await groups.getGroupsFields(groupNames, ['memberPostCids']);
        groupNames = groupNames.filter((groupName, idx) => (
            !groupData[idx].memberPostCidsArray.length ||
            groupData[idx].memberPostCidsArray.includes(postData.cid)
        ));

//        console.log("GROUPNAMES AFTER FILTERING");
//        console.log(groupNames);

        const keys = groupNames.map(groupName => `group:${groupName}:member:pids`);
        await db.sortedSetsAdd(keys, postData.timestamp, postData.pid);
        await Promise.all(groupNames.map(name => truncateMemberPosts(name)));
    };

    async function truncateMemberPosts(groupName) {
        let lastPid = await db.getSortedSetRevRange(`group:${groupName}:member:pids`, 10, 10);
        lastPid = lastPid[0];
        if (!parseInt(lastPid, 10)) {
            return;
        }
        const score = await db.sortedSetScore(`group:${groupName}:member:pids`, lastPid);
        await db.sortedSetsRemoveRangeByScore([`group:${groupName}:member:pids`], '-inf', score);
    }

    Groups.getLatestMemberPosts = async function (groupName, max, uid) {
        let pids = await db.getSortedSetRevRange(`group:${groupName}:member:pids`, 0, max - 1);
        pids = await privileges.posts.filter('topics:read', pids, uid);
        return await posts.getPostSummaryByPids(pids, uid, { stripTags: false });
    };

    //new function filter by name of group
    Groups.getLatestMemberPostsByGroup = async function (groupName, max, uid, filterWords = []) {
        let pids = await db.getSortedSetRevRange(`group:${groupName}:member:pids`, 0, max - 1);
        pids = await privileges.posts.filter('topics:read', pids, uid);
        let postSummaries = await posts.getPostSummaryByPids(pids, uid, { stripTags: false });

        // Filter posts by the presence of certain words
        if (filterWords.length > 0) {
            postSummaries = postSummaries.filter(post =>
                filterWords.some(word => post.content.includes(word))
            );
        }

        return postSummaries;
    };
};
