## Database structure

<!-- api from milestone 2 will have to be updated btw but I think that's only needed updated for final project deadline and not for now-->

### User table

|Column      |Data Type|Description|
|------------|---------|-----------|
|email       |text|The email associated with the account|
|display_name|text|The name displayed to users|
|phone_number|text|The user's phone number|
|salt|text|The salt associated with the hash| <!-- might change this to just have one with the hash data in it using -->
|hash|text|The hashed password+salt|
<!-- using "text" not string since I'm going off of postgresql types  -->

### Task table

|Column      |Data Type|Description|
|------------|---------|-----------|
|title|string|The title of the request.|
|description|string|The description for the request.| 
|user_name|string|Display name of the user who submitted the request.|
|location|string|Location for the request.|
|email|string|Email of the user who submitted the request.|
|phone_number|string|Phone number of the user who submitted the request.|
|id|SERIAL|A numerical id distinct for each added request.|

### Comment table

|Column      |Data Type|Description|
|------------|---------|-----------|
|task_id|integer|The id value for the associated task.|
|user_name|string|Display name of the user who sent the comment.|
|contents|string|The text of the comment.|



## Division of Labor