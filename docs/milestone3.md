## Site link

https://cs326-final-vav-project.herokuapp.com/
<!-- For some reason in instructions it says to put this in the final.md but I think that's a typo and it means milestone-3 since final.md isn't stated to be created until after that -->

## Database structure

<!-- api from milestone 2 will have to be updated btw but I think that's only needed updated for final project deadline and not for now-->

### User table

|Column      |Data Type|Description|
|------------|---------|-----------|
|email       |text|The email associated with the account|
|display_name|text|The name displayed to users|
|phone_number|text|The user's phone number|
|salt|text|The salt associated with the hash| <!-- might change this to just have one with the hash data in it using pgcrypto -->
|hash|text|The hashed password+salt|
<!-- using "text" not string since I'm going off of postgresql types  -->
<!-- I'm not clear if we're supposed to be doing hashing stuff really or not though since it's not included until after the original deadline? Were we just suppose to store in plaintext? -->
<!-- TODO should maybe change the others to say "text" etc. or just make consistent and say string for all -->

### Task table

|Column      |Data Type|Description|
|------------|---------|-----------|
|title|string|The title of the request.|
|description|string|The description for the request.| 
|user_name|string|Display name of the user who submitted the request.|
|location|string|Location for the request.|
|email|string|Email of the user who submitted the request.|
|phone_number|string|Phone number of the user who submitted the request.|
|id|serial|A numerical id distinct for each added request.|

### Comment table

|Column      |Data Type|Description|
|------------|---------|-----------|
|task_id|integer|The id value for the associated task.|
|user_name|string|Display name of the user who sent the comment.|
|contents|string|The text of the comment.|



## Division of Labor

Griffin Evans: Login and user authentification; setup of database structure and tables

Joseph Yang:

Aaron Tsui: