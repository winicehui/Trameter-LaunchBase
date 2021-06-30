# Trameter - Launch Base Web Application
Developing a powerful internal tool to house the information of numerous market channels that have been identified for Trameter's launch. 

### Online
Firebase Hosting URL:
```
https://launchbase-581e0.firebaseapp.com/
```
## Terminology
* Market Segment (Ex: 'Enthusiasts'): A group of people who share one or more common characteristics, lumped together for marketing purposes. 
* Market Channel (Ex: 'Phocus Wire'): A route or way to market product and services that consumers and business buyers purchase
* Channel Category (Ex: 'Travel Websites') : A class of market channels regarded to have shared characteristics 

## Functionalities (see Video Below for more information)
* CRUD operations (Add, Edit, Delete, Reorder channel categories; Add, Edit, Delete market channels)
* Real time updates (with Firebase)
* Sorting market channels based on rating
* URL Routing (URL query parameters for market segment and channel category)
* Advanced filtering and search function

https://user-images.githubusercontent.com/35130094/123926643-ef3fc400-d940-11eb-83da-f35bf041584d.mp4

## Set-up

### Requirements
1. Node.js & NPM <br>
https://nodejs.org/en/download/ <br> 
https://www.npmjs.com/get-npm

### Installation
1. Clone repository onto local machine.
2. Navigate to local respository folder in Terminal.
3. Install dependencies by running  "npm install".

### Run Project Locally
1. Navigate to respository folder in Terminal.
2. Run: "npm run start". 
3. Navigate to "localhost:3000" on local web browser to see the application running locally on your machine.

## Pushing Edits

### To push edits to Github respository: 
1. Add files you would like to push, or run: "git add ."
2. Run: "git commit -m "commit-message""
3. Run: "git push"

### To deploy edits to Firebase:
1. Run "npm run build" in Terminal. 
2. Run "firebase deploy -m message" in Terminal.
