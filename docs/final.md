# Title

Team Vav

# Subtitle

UMass Quarantine Requests

# Semester

Fall 2021

# Overview

Our application is for UMass students under quarantine to make requests and helpers to complete those requests. Requests may include food requests, mail requests, and requests for COVID-19 tests from UMass UHS. 
<!-- "You should also mention why your application is innovative"  -->
The innovative idea behind this concept essentially comes in using similar techniques to existing services but with a different purpose in mind—conceptually the site is somewhat like a forum or job posting site, but the focus is on giving a way for people to share and respond to one-time volunteer tasks rather than either facilitating discussions or providing long-term paid positions. Hence the site fits into a distinct niche, providing a service which stands out from existing resources.

# Team Members

Aaron Tsui - **OfficialAaronTsui2** & **OfficialAaronTsui**

Griffin Evans - **grievans**

Joseph Yang - **JoJo-19** 

# User Interface

![This is our home page where users would login or register.](diagrams/final/login.png)
This is our home page where users would login or register. The Logout button on the Navbar would also direct the user to this page.

![This is the page where user will land after login/register.](diagrams/final/requestOrHelp.png)
This is the page where user will land after login/register. Here the user will have options to start making requests or be a helper to view current requests. The Home button on the Navbar would also direct the user to this page

![This is the page where user would make request.](diagrams/final/makeRequest.png)
This is the page where user would make request with a request title, request description, name, location and contact info. They can also update and delete their request on this page.

![This would be the page where the user would land on when request is submitted.](diagrams/final/requestDone.png)
This would be the page where the user would land on when request is submitted. Where the user can send messages to the helper or adding additional instructions on the request.

![This is the page where user can view all the current requests.](diagrams/final/viewRequest.png)
This is the page where user/helper can view all the current requests.

![A screenshot of a page with information fields representing the details and user contact information for another user's request.](diagrams/final/helperView.png)
This is the page where a helper can view the details of a request they are looking at.

![A screenshot of a page with text fields marked "Display Name" and "Phone Number" and buttons marked "Update Defaults" and "Delete Account".](diagrams/final/profile.png)
This is the page where a user can examine and edit the default entry values set for their account. They can also delete their account from this page. This page is accessible through the "Account Info" button on the Navbar.

![A drop-down menu showing buttons marked "Home", "Back", "Contact", "Account Info", and "Logout".](diagrams/final/navbar.png)
An expanded view of the Navbar that appears at the top of each page besides the Login page. Has options for linking to the aforementioned user profile and welcome page, and to log out and return to the login page. As well as these it also has a "Back" button that goes to the previously visited page and a "Contact" link to email one of the site creators.




# APIs

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




## Create Task
Creates a new request. 

**POST** /task


*Parameters:*

| Name | Type | In | Description |
|--------------|--------------------|------|--------------|
|title|string|body|The title for the request to be made.|
|description|string|body|The description for the request.| 
|user_name|string|body|Name for the person who submitted the request.|
|location|string|body|Location for the request.|
|email|string|body|Email to reach the person asking for help.|
|phone_number|string|body|Phone number to reach the person asking for help.|

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

Gets the list of active tasks.

**GET** /task

*Parameters:* none

*Response:*

Example output would be:

    [
        {
            title: '',
            description: '',
            user_name: '',
            location: '',
            email: '',
            phone_number: '',
            req_status: '',
            id: 0
        }
    ]

On failure:

    Status: 500 Internal Server Error



## Delete Tasks
Delete the specified task as well as any comments associated with that task.

**DELETE** /task/:id

*Parameters:*

| Name | Type | In | Description |
|--------------|--------------------|------|--------------|
|id|integer|params|The ID of the request to be deleted.|

*Use:*

  Client: Request delete from server.

  Server: Delete from DB. Let client know it's deleted from DB.

*Response:*

Example output would be:

    'Deleted task.'

On failure:

    Status: 500 Internal Server Error

## Edit Task
Update the requested task.

**PUT** /task/:id

*Parameters:*

| Name | Type | In | Description |
|--------------|--------------------|------|--------------|
|id|integer|params|The ID of the request to be updated|
|title|string|body|The title to change the task's title to.|
|description|string|body|The description to change to.| 
|user_name|string|body|Name for the person who submited the request.|
|req_location|string|body|Location for the request.|
|email|string|body|Email to reach the person asking for help.|
|phoneNumber|string|body|Phone number to reach the person asking for help.|
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
Mark task as in-progress.

**POST** /markProgress/:id

| Name | Type | In | Description |
|--------------|--------------------|------|--------------|
|id|integer|params|The ID of the request to be updated|

*Response:*
    
    Status: 204 No Content

On failure:

    Status: 500 Internal Server Error


## Create Comment

Requester creates new comment, server stores comment with the associated task.

**POST** /comment/

*Parameters:*
| Name | Type | In | Description |
|------|------|----|-------------|
|task_id | integer | body | Identification number for the task this comment is being posted on.|
|user_name| string | body | A name for the user sending the comment.|
|contents | string | body |The text body of the comment.|


*Response:*

    Status: 201 Created

On failure:

    Status: 500 Internal Server Error

## Get comments

Gets all comments on the specified task.

**GET** /comment

*Parameters:*
| Name | Type | In | Description |
|------|------|----|-------------|
|task_id | integer | body | Identification number for the task.|


*Response:*

    Status: 200 OK
    Response contains a json object containing the array of comments

On failure:

    Status: 500 Internal Server Error


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
|/quarantining.html|html|Page used to make a new request.|Doesn't require authentication to access but should be logged in for the loading of user defaults.|
|/status.html|html|Displays status of a created task.||
|/requestHolder.html|html|Displays currently active tasks.||
|/requestProgress.html|html|Displays info of a selected task.||
|/images/campus.jpg|image|Image file loaded as a background for other pages||
<!-- |/images/campus2.jpg|image||| No longer being used so will leave out, I think-->


# Authentication/Authorization

Authentication is implemented using the *Passport* package and its *passport-local* module. Starting from the login page, the user enters their account's associated email and password. If they don't have an account, clicking the *Create Account* button will add an account to the database (assuming that email is not already in use), storing the email and salted hash (with the corresponding salt as well) for the password in the *users* table. After creating an account, or if they already have an account, they can log in, at which point the server takes a `POST` request containing the user's email and password, which is used with `passport.authenticate("local")` which then checks if it can find an account with that email in the *users* table, and if so then checks if salting and hashing the request's password gives a matching hash to the hash already stored in the table. If this process succeeds then authenticated as being logged in, and a user object is created for the current session, which stores the email that was used to log in.

Later requests to the server then use this user data to verify that the request-sender has permission to perform the relevant actions. When on the `profile.html` page, one can see the publicly viewable data (email, display name, and phone number, if the latter two have been set) for the current user and using the *Update Defaults* button can make a request to `/user/edit`, which allows them to change the contact information (phone number and display name) that appears as a default when creating a new task. This first checks that the user is logged in (using `checkLoggedIn`, which checks if the request is authenticated and if not, stops the current request and redirects the user back to the login page) then checks if the email sent in the request matches that of the logged-in user, and if so proceeds to update their row in the *users* table to match the new information. Similarly, the `/user/delete` request, which can be triggered by another button from `profile.html`,  only proceeds if the user requesting the delete has the same email as the account being deleted, again using `checkLoggedIn`, and otherwise no change is made to the database. Also note `/user/logout`, which has a request made to it when the user presses the *Logout* button in the Navbar at the top of each page, which logs the user out, ending their current session and redirecting them to the login page. Posting comments via `/comment` also requires being authenticated as logged in.

<!-- Only other thing besides account data stuff that actually checks for login currently is /comment which doesn't really do anything with that logged-in status so not really sure what else to say. delete("/task/:id") had checkLoggedIn but has since been commented out  -->

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
* Updated stylization of site
* All of account/login
    * Set up login and profile pages and their respective code
    * Login and account creation + storing of user data in database
        * User authentication and logout
    * Editing and deletion options for user profile
* Connection of project to Heroku
* Setup of database structure and respective documentation
    * Initialization of server connection to PostgreSQL and creation of tables
* Miscellaneous fixes and tweaks to other sections of code to resolve bugs and inconsistencies
* Updating of documentation for Database and API sections for final version
* Creation of URL Routes/Mappings and Authentication documentation
* Added details about "innovative idea" to Overview section of documentation
* Added some more details to the UI section
* Wrote Conclusion section
* Code cleanup

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
* Added images and descriptions for UI documentation

# Conclusion

<!-- "A conclusion describing your team’s experience in working on this project. This should include what you learned through the design and implementation process, the difficulties you encountered, what your team would have liked to know before starting the project that would have helped you later, and any other technical hurdles that your team encountered." -->

A big part of the difficulty of this project was of course the need to adapt to using various packages and services (for example Heroku, PostgreSQL, and JS Modules like Express, pg-promise, and Passport) which we hadn't used before this class in order to make it. Through the process of working on the project though we've thus learned to better be able to integrate these into our projects. 

Another difficult aspect was trying to plan out how parts of the project would be structured when they involved interactions with parts that would not be done until later—for instance, planning out the front-end API calls before having figured out how features like the databases and the authentication system would be structured was difficult (e.g. not having planned out the database structure led to figuring out what particular parameters need to be passed in to be used in the database difficult) and ended up later leading to a lot of back-and-forth editing to ensure the front- and back-end would interact correctly. In fact in general, the task of integrating front-end and back-end elements of the code and determining things like what operations need to be done on what side was a difficult process—not being used to writing server code before this course—though again now we have more experience to enable better judgement when facing these sorts of situations in the future.

In retrospect something that would have been good would be to plan out aspects like what database systems we would be using earlier in the project even if not actually implementing them at that point, as that would have allowed us to better plan around them and potentially even practice with smaller-scale prototypes as preparation before needing to implement them into the main project.

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

### &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; Total:  ___ / 100 points

## Site link
https://cs326-final-vav-project.herokuapp.com/
