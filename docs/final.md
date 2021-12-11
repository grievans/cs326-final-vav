# Title
Team Vav
# Subtitle
UMass Quarantine Requests
# Semester
Fall 2021
# Overview
Our application is for UMass students under quarantine to make requests and helpers to complete those requests. Requests may include food requests, mail requests, and requests for COVID-19 tests from UMass UHS. 
<!-- TODO "You should also mention why your application is innovative"  -->
# Team Members
Aaron Tsui - **OfficialAaronTsui2** & **OfficialAaronTsui**

Griffin Evans - **grievans**

Joseph Yang - **JoJo-19** 
# User Interface
<!-- TODO!!!!! -->

# Final Rubric

### General &emsp; &emsp; &emsp; &emsp; &emsp; ___ / 30 pts

- Authentication 
  - Successfully create a user through sign-up **5 pts**
  - Successfully login a user using details stored from sign-up **5 pts**
  - Only able to view the details of the inner pages if you are a user. **5 pts**
    - Only able to edit account details corresponding to the currently logged-in user.
- Routing **15 pts**

### Tasks &emsp; &emsp; &emsp; &emsp; &emsp; ___ / 15 pts
- Successfully create tasks **4 pts**
- Successfully update tasks **4 pts**
- Successfully view tasks **4 pts**
- Successfully delete tasks **3 pts**
  - Task deletion also deletes all related details like comments specific to task

### Comments &emsp; &emsp; &emsp; &emsp; &emsp; ___ / 30 pts
- Successfully create comments **15 pts**
- Users can send comments to each other within application **15 pts**

### CRUD &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp;  ___ / 25 pts									
- Create: **3 pts each**
  - Users
  - Tasks
  - Comments
- Read: **3 pts each**
  - Tasks
  - User info
- Update: **3 pts each**
  - Tasks
  - User info
- Delete: **2 pts each**
  - Tasks
  - Users
<!--  I haven't made a button on the site for that still but thinking I might just so we have more features to show; should already be implemented in backend fine I think  -->

### &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; Total:  ___ / 100 points


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

**DELETE** /user/delete

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
|id|integer|params|The ID of the request to be deleted.|

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


<!-- TODO: above section still to finish being updated -->

# Database

## User table

|Column      |Data Type|Description|Constraints|
|------------|---------|-----------|---|
|email       |text|The email associated with the account.|UNIQUE|
|display_name|text|The name displayed to users.||
|phone_number|text|The user's phone number.||
|salt|text|The salt associated with the hash.|NOT NULL|
|hash|text|The hashed password+salt.|NOT NULL|
<!-- using "text" not string since I'm going off of postgresql types  -->

## Task table

|Column      |Data Type|Description|Constraints|
|------------|---------|-----------|----|
|title|text|The title of the request.||
|description|text|The description for the request.||
|user_name|text|Display name of the user who submitted the request.||
|location|text|Location for the request.||
|email|text|Email of the user who submitted the request.||
|phone_number|text|Phone number of the user who submitted the request.||
|req_status|text|The request status of the current task.||
|id|serial|A numerical id, distinct/unique for each added request. Automatically set.|UNIQUE|
<!-- sidenote apparently there's a new way to do this sort of thing in recent versions of PostgreSQL using "identity columns" but I think serial is fine for our purposes. -->
<!-- also note technically serial isn't a true type, rather a variant of integer that postgresql has as syntactic sugar, but I think it makes sense just to say serial as the type here -->

## Comment table

|Column      |Data Type|Description|Constraints|
|------------|---------|-----------|---|
|task_id|integer|The id value for the associated task.||
|user_name|text|Display name of the user who sent the comment.||
|contents|text|The text of the comment.||

# URL Routes/Mappings

|Route|Method/Type|Description|Authentication Details (where applicable)|
|----|----|----|----|
|/user/login|POST|Logs an existing user into their account.|Only works if hash of password matches that of the account in the database, then sets the user to be authenticated for the rest of the session.|
|/user/logout|GET|Logs out the current user.||
|/user/new|POST|Creates a new user when provided with a new email and a password.||
|/user/edit|PUT|Edits the default values that appear when the user makes a new task.|Requires the user to be logged in; only works if attempting to edit the account that the client is authenticated as being.|
|/user/delete|DELETE|Removes a user's account from the database.|Again requires login and that the client account is authenticated as matching the target account.|
|/user/data|GET|Gets publicly viewable data for an account (name, email, phone number).||
|/task|POST|Creates a new task using the provided title, description, etc.|| <!-- should probably have some authentication for this (really should probably be storing what account makes each) but doesn't currently -->
|/task|GET|Gets the list of currently available tasks.||
|/task/:id|PUT|Updates an already created task.||
|/task/:id|DELETE|Removes a task and its associated comments from the database.|| <!-- again really ought to have some sort of authentication I guess to check that the corresponding user is the creator of the task or something like that -->
|/comment|POST|Creates a new comment on a task specified by ID.||
|/comment|GET|Gets an array of the comments on the specified task.||
|/index.html|html|Introduction and login page|Needs no authentication to access but is used to set up later authentication.|
|/profile.html|html|User profile page, where accounts can be updated or deleted.|Updating/deleting requires authentication, as specified earlier.|
|/welcome.html|html|Welcome page leading users to the pages for making/viewing requests.||
|/quarantining.html|html|Page used to make a new request.|Doesn't require authentication to access but do should be logged in for the loading of user defaults.|
|/status.html|html|Displays status of a created task.||
|/requestHolder.html|html|Displays currently active tasks.||
|/requestProgress.html|html|Displays info of a selected task.||
|/images/campus.jpg|image|Image file loaded as a background for other pages||
<!-- |/images/campus2.jpg|image||| No longer being used so will leave out, I think-->


# Authentication/Authorization

Authentication is implemented using the *Passport* package and its *passport-local* module. Starting from the login page, the user enters their account's associated email and password. If they don't have an account, clicking the *Create Account* button will add an account to the database (assuming that email is not already in use), storing the email and salted hash (with the corresponding salt as well) for the password in the *users* table. After creating an account, or if they already have an account, they can log in, at which point the server takes a `POST` request containing the user's email and password, which is used with `passport.authenticate("local")` which then checks if it can find an account with that email in the *users* table, and if so then checks if salting and hashing the request's password gives a matching hash to the hash already stored in the table. If this process succeeds then authenticated as being logged in, and a user object is created for the current session, which stores the email that was used to log in.

Later requests to the server then use this user data to verify that the request-sender has permission to perform the relevant actions. When on the `profile.html` page, one can see the publicly viewable data (email, display name, and phone number, if the latter two have been set) for the current user and using the *Update Defaults* button can make a request to `/user/edit`, which allows them to change the contact information (phone number and display name) that appears as a default when creating a new task. This first checks that the user is logged in (using `checkLoggedIn`, which checks if the request is authenticated and if not, stops the current request and redirects the user back to the login page) then checks if the email sent in the request matches that of the logged-in user, and if so proceeds to update their row in the *users* table to match the new information. Similarly, the `/user/delete` request only proceeds if the user requesting the delete has the same email as the account being deleted, again using `checkLoggedIn`, and otherwise no change is made to the database. Also note `/user/logout`, which has a request made to it when the user presses the *Logout* button in the Navbar at the top of each page, which logs the user out, ending their current session and redirecting them to the login page.
<!-- TODO maybe should add an account delete button to profile.html -->

On the `quarantining.html` page .... **TODO**
<!-- TODO put description for how task and comments use authentication; I (Griffin) can write this probably but might hold off until I'm sure it actually all works first so I have the most up-to-date description to give. -->

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
* Created and Modified Rubric


Griffin Evans
* Created initial wireframe
* Advanced overall site code
* Redesigned status page and reformatted multiple pages
* Stylized site better
* All of account/login
* Login and user authentication + storing of user data in database
* logout and user profile options
* Setup of database structure and respective documentation
* initialization of server connection to PostgreSQL and creation of tables
* Updating of documentation for database and API

Joseph Yang
* Modified wireframe design 
* Created majority of right branch of site in code
* Created navigation bar on site
* Added visual effects to site
* Modified links across site
* All of Task-based requests
* Modified rubric
* Updated database structure
* Completed all tasks/ requests related operations from asking request, updating request, deleting request from user and marking requests status from helper + debug

# Conclusion



## Site link
https://cs326-final-vav-project.herokuapp.com/
