# Milestone 2

## Part 0: Project API Planning

### Login

Gets a token to be used for logging the client into a specified account, given the correct email and password. Note logging out does not depend on any server data, and thus there is not an equivalent operation for that.

**GET** /user/login

*Parameters:*
| Name | Type | In | Description |
|------|------|----|----------|
|user_email|string|body|The email used by the account|
|password|string|body|Password of the account (to be hashed and compared)|
<!-- Seems like hashing would be server side? Not sure, just basing off of what other APIs seem to do. -->

*Response:*

    Status: 200 (OK)
    {
        "login_status": "valid",
        "session_token": "xxxxxxxxxxx"
    }



### Logout (might only need to be client-side?)

...TODO MAYBE DELETE

### Create account

...

**POST** /user/new/

Parameters:
| Name | Type | In | Description |
|------|------|----|----------|
|user_email|string|body|The email to be used for the new account|
|password|string|body|Password to be hashed and set for the account|
||||

### Edit account

...

### Get account data

...

create task, get data of a task, resolve (delete) tasks, edit task info, mark task in progress (a variant of editing info? maybe separate since different authentication is needed to do it), get list of open tasks

create comment, get list of comments for a task?, deleting comments (might just make part of deleting a task)?

### Create Comment

create comment, get list of comments for a task?

**POST** /comment/{commentId}

Requester creates new comment with commentId, server stores comment with requestId.

Parameters:
| Name | Type | In | Description |
|------|------|----|-------------|
requestId | integer | query | Identification Number for the request.
commentId | integer |path |Identification Number for the comment.


*Response:*

    Status: 200 (OK)
    {
        "comment_creation": "successful",
        "session_token": "xxxxxxxxxxx"
    }

### Get comments
**GET** /comment/all
Helper gets all comments.

Parameters:
| Name | Type | In | Description |
|------|------|----|-------------|
requestId | integer | query | Identification Number for the request.
all | string |path |maximum number of comments to show parameter.


*Response:*

    Status: 200 (OK)
    {
        "all_comments": "true",
        "session_token": "xxxxxxxxxxx"
    }


## Part 2: Front-end Implementation

TODO insert screenshots+brief description

## Division of labor
