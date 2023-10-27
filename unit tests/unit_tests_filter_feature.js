'use strict';

const Groups = require('../src/groups');
const db = require('./mocks/databasemock');
const privileges = require('../src/privileges');
const posts = require('../src/posts');

describe('Groups', () => {
    describe('getLatestMemberPosts', () => {
        it('should return posts filtered by given words', async () => {
            // Mock the database and privileges calls
            db.getSortedSetRevRange = jest.fn().mockResolvedValue(['pid1', 'pid2', 'pid3']);
            privileges.posts.filter = jest.fn().mockResolvedValue(['pid1', 'pid2']);
            posts.getPostSummaryByPids = jest.fn().mockResolvedValue([
                { pid: 'pid1', content: 'This is a test post' },
                { pid: 'pid2', content: 'Another test post' },
            ]);

            const result = await Groups.getLatestMemberPosts('testGroup', 10, 1, ['test']);

            expect(result).toEqual([
                { pid: 'pid1', content: 'This is a test post' },
                { pid: 'pid2', content: 'Another test post' },
            ]);
        });

        it('should return empty array if no posts match the filter words', async () => {
            // Mock the database and privileges calls
            db.getSortedSetRevRange = jest.fn().mockResolvedValue(['pid1', 'pid2', 'pid3']);
            privileges.posts.filter = jest.fn().mockResolvedValue(['pid1', 'pid2']);
            posts.getPostSummaryByPids = jest.fn().mockResolvedValue([
                { pid: 'pid1', content: 'This is a test post' },
                { pid: 'pid2', content: 'Another test post' },
            ]);

            const result = await Groups.getLatestMemberPosts('testGroup', 10, 1, ['nonexistentword']);

            expect(result).toEqual([]);
        });
    });
});
