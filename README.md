# This is my full stack project 
in this project i have used:
- JavaScript
- Express 
- Express-Handlebars 
- mongoDB (noSQL database)
- mongoose 
- sessions

## What my site does
To access the site you have to sign up then log in, i achieved this feature by using sessions to make sure the user has an active session before allowing them to access the page.
When logged in, the user has two features to choose from- they can either request data on a harry potter character or be sorted into a hogwarts house...
Both of these features use API data to return what the user requests.
On the characters page you can search by name or by character alias.

## How the log in works
When the user inputs their email and password- we check the users database for an email that matches their input then if the passwords match aswell, their session begins and they are grante access to the website.