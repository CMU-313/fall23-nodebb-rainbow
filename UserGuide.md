# NodeBB Team Rainbow 

## Description

This is a description of how to test implemented features for NodeBB. It allows users to post questions and answers, filter posts to appear in specific groups and also includes a search feature. Please note that the display of searched posts is currently experiencing a bug and may not work as expected.

## Features and Testing 

1. **Q&A Board**: Users can view and post questions on the Q&A board.

2. **Search Feature**: Users can search for posts using the search bar. Due to a last-minute bug, the display of searched posts may not work as expected. However, you can see the backend queries being loaded by following these steps:
    - Go to `http://localhost:YOUR_PORT_NUMBER/api/posts/search?keyword=SEARCH_KEYWORD`
    - This will display the post entities from the database.

3. **User Accounts**: You can create an admin account and multiple regular accounts. If you post in the regular accounts in the private question and answer category, only those accounts and the admin account will be able to see the post.

4. **Filter Feature**: By mentioning a group name in a post, the post will only appear only in specific group.
   Example: Create a group called "17-313" and create a post that mentions "17-313" and only the specific group will include the post (make sure to uncomment line 76 and comment out line 75 to see the functionality in controllers/group.js)
   Unit tests for the functionality in `unit_tests_filter_feature.js` file and download `npm install --save-dev` jest to use unit test
