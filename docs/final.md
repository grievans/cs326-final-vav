# Title
Team Vav
# Subtitle
UMass Quarantine Requests
# Semester
Fall 2021
# Overview

# Team Members
Aaron - **OfficialAaronTsui** & **OfficialAaronTsui2**

Griffin Evans - **grievans**

Joseph Yang - **JoJo-19** 
# User Interface

# APIs

<!-- TODO working on updating these to reflect current implementation. Currently up to "/user/data" has been updated -->
## Login

Attempts to log the client into a specified account, given a correct email and password.

**POST** /user/login

*Parameters:*
| Name | Type | In | Description |
|------|------|----|----------|
|user_email|string|header|The email used by the account.|
|password|string|header|Password of the account (to be hashed and compared).|

*Response:*

    Status: 200 OK
    {
        "login_status": "valid"
    }

If `password` or `user_email` is incorrect:

    Status: 401 Unauthorized



## Logout

**GET** /user/logout

Ends the current user's login session and redirects the client to the login page. Note no parameters are needed.

## Create account

Creates a new account, if `user_email` is not already in use. Note this does not log in that user. 

**POST** /user/new

*Parameters:*

| Name | Type | In | Description |
|------|------|----|----------|
|user_email|string|body|The email to be used for the new account. Must be a non-empty string.|
|password|string|body|Password to be hashed and set for the account. Must be a non-empty string.|
|display_name|string|body|If present, sets this name to be shown in the account's contact details.|
|phone_number|string|body|If present, sets this number to be shown in the account's contact details. Note that the type is *string*, not number.|

*Response:*

    Status: 201 Created
<!-- TODO maybe add details of what the res.send lists for these? The status is what's actually used really though, that's just a bit of extra detail -->

If the email is already in use:

    Status: 304 Not Modified

If `email` or `password` is an empty string:

    Status: 400 Bad Request

If an error occurs when adding the account to the database:

    Status: 500 Internal Server Error

## Edit account

Edits details of the current user's account.

**PUT** /user/edit

*Parameters:*

| Name | Type | In | Description |
|------|------|----|----------|
|user_email|string|body|The email of the current user.|
|display_name|string|body|If present, a name to change the account's display name to.|
|phone_number|string|body|If present, what to change the account's phone number to.|
<!-- TODO maybe I should add being able to change password? wouldn't be too hard to implement I think, basically just make a new salt+hash and put that in. SHOULD already be authenticated -->

*Response:*

    Status: 204 No Content

If user is not authenticated as being the account `user_email`:

    Status: 403 Forbidden

If an error occurs when accessing the account in the database:

    Status: 500 Internal Server Error

## Delete account

Removes the user's account from the database.

**PUT** /user/delete

*Parameters:*

| Name | Type | In | Description |
|------|------|----|----------|
|user_email|string|body|The email of the current user.|

*Response:*

    Status: 204 No Content

If user is not authenticated as being the account `user_email`:

    Status: 403 Forbidden

If an error occurs when removing the account from the database:

    Status: 500 Internal Server Error

## Get account data

Retrieves the publicly viewable data for an account, specified by the associated email.

**GET** /user/data/?target_email=`target_email`

*Parameters:*

| Name | Type | In | Description |
|------|------|----|----------|
|target_email|string|query|The address of the user to retrieve data for.|

*Response:*

    Status: 200 OK
    {
        "email": "xxxxxx@example.com",
        "display_name": "Xxxxx Xxx",
        "phone_number": "555-555-5555"
    }

If `target_email` has no matching account:

    404 Not Found




<!-- TODO API section below still to be updated -->

## Create Task
Creates a new request. 

**POST** /task

method: post

*Parameters:*

| requestTitle | requestDescription | name | req_location | email | phoneNumber | 
|--------------|--------------------|------|--------------|-------|-------------|
|requestTitle|string|body|The request to be made.|
|requestDescription|string|body|The description for the request.| 
|name|string|body|Name for the person who submit request.|
|req_location|string|body|Location for the request.|
|email|string|body|Email to reach the person asking for help.|
|phoneNumber|string|body|Phone number to reach the person asking for help.|

*Response:*
    Client side: stored info in req.body and send to server.

    Server: Status: 201 Created. Use req.body to handle it, example output would be:
    Post body: 
{
  requestTitle: '',
  requestDescription: '',
  name: '',
  req_location: '',
  email: '',
  phoneNumber: ''
}

## Get Task Data
Review the request made.

**GET** /task
method: get

*Parameters:*

| requestTitle | requestDescription | name | req_location | email | phoneNumber | 
|--------------|--------------------|------|--------------|-------|-------------|
|requestTitle|string|body|The request to be made.|
|requestDescription|string|body|The description for the request.| 
|name|string|body|Name for the person who submit request.|
|req_location|string|body|Location for the request.|
|email|string|body|Email to reach the person asking for help.|
|phoneNumber|string|body|Phone number to reach the person asking for help.|

*Response:*
    Client side: Request data from server.
    Server: Abstract data from DB(future). Check authentication to proceed/ return(future). Send data to client.

    Example output would be:
    Get param: 
{
  requestTitle: '',
  requestDescription: '',
  name: '',
  req_location: '',
  email: '',
  phoneNumber: ''
}


## Delete Tasks
Delete the requested data.

**DELETE** /task
method: delete

*Parameters:*

| requestTitle | requestDescription | name | req_location | email | phoneNumber | 
|--------------|--------------------|------|--------------|-------|-------------|
|requestTitle|string|body|The request to be made.|
|requestDescription|string|body|The description for the request.| 
|name|string|body|Name for the person who submit request.|
|req_location|string|body|Location for the request.|
|email|string|body|Email to reach the person asking for help.|
|phoneNumber|string|body|Phone number to reach the person asking for help.|

*Response:*
    Client: Request delete from server.
    Server: Delete from DB(future). Let client know it's deleted from DB.
    Example output would be:
    'Deleted, you are all set!!!!'

## Edit Task
Update the requested data.

**PUT** /task
method: put

*Parameters:*

| requestTitle | requestDescription | name | req_location | email | phoneNumber | 
|--------------|--------------------|------|--------------|-------|-------------|
|requestTitle|string|body|The request to be made.|
|requestDescription|string|body|The description for the request.| 
|name|string|body|Name for the person who submit request.|
|req_location|string|body|Location for the request.|
|email|string|body|Email to reach the person asking for help.|
|phoneNumber|string|body|Phone number to reach the person asking for help.|

*Response:*
    Client side: stored info in req.body and send to server.

    Server: Status: 201 Created. Use req.body to handle it, example output would be:
    Post body: 
{
  requestTitle: '',
  requestDescription: '',
  name: '',
  req_location: '',
  email: '',
  phoneNumber: ''
}


## Task Progress
Mark/ update task progress.

**POST** /markProgress
method: post

*Response:*
    Client: Let the client know task status has changed.
    Server: Change status.html to 'in progress'
    Sample dummy output:
    Post body: 
{ ok: true }




## Create Comment

create comment, get list of comments for a task?

**POST** /comment/{commentId}

Requester creates new comment with commentId, server stores comment with requestId.

*Parameters:*
| Name | Type | In | Description |
|------|------|----|-------------|
requestId | integer | query | Identification Number for the request.
commentId | integer |path |Identification Number for the comment.


*Response:*

    Status: 200 OK
    {
        "comment_creation": "successful",
        "session_token": "xxxxxxxxxxx"
    }

## Get comments
**GET** /comment/all
Helper gets all comments.

*Parameters:*
| Name | Type | In | Description |
|------|------|----|-------------|
requestId | integer | query | Identification Number for the request.
all | string |path |maximum number of comments to show parameter.


*Response:*

    Status: 200 OK
    {
        "all_comments": "true",
        "session_token": "xxxxxxxxxxx"
    }



# Database

# URL Routes/Mappings

# Authentication/Authorization

# Division of Labor
Aaron Tsui
* Created majority of main branch of site in code
* Created majority of left branch of site in code
* Advanced wireframe in initial version of code
* Updated wireframe to modern, current version of code
* All of Comment/creation/deletion
* Completed all comment related operations
* Setup of database structure and tables
* Application Testing and Debugging
* Field designing and modification


Griffin Evans
* Created initial wireframe
* Advanced overall site code
* Redesigned status page and reformatted multiple pages
* Stylized site better
* All of account/login
* Login and user authentification + storing of user data in database
* logout and user profile options
* Setup of database structure and respective documentation
* initialization of server connection to PostgreSQL and creation of tables

Joseph Yang
* Created majority of right branch of site in code
* Created navigation bar on site
* Added visual effects to site
* Modified links across site
* All of Task-based requests
* Completed all tasks/ requests related operations from asking request, updating request, deleting request from user and marking requests status from helper + debug

# Conclusion



## Site link
https://cs326-final-vav-project.herokuapp.com/
