# AAW_Project

Association for Acedemic Women at the University of Florida website repository.

The website is deployed here: https://aawufl.herokuapp.com/

To run the website on localhost, first clone the repository on your computer and do the following:

 1. Install Node.js version 6.12.0 with npm version 3.10.10 on your computer.
 2. Install Ruby on your computer: http://rubyinstaller.org/downloads/
 3. If you are running Windows, install Pthon 2.7.x and MS Visual Studio C++ 2012 Express (https://www.microsoft.com/en-in/download/details.aspx?id=30679) .
 4. Install Sass using `gem install sass` in terminal or command prompt
 5. Perform the following commands to install these Node packages globally in  terminal or command prompt:
 
     `npm install -g bower`
     
     `npm install -g grunt-cli`
     
     `npm install -g grunt`
     
     `npm install -g yo`
     
     `npm install -g generator-meanjs`
 
 6. In terminal or command prompt, go to the repository folder and run:
 
     `npm install`
     
     `bower install`
     
7. Run `grunt` in terminal or command prompt while still in the repository folder. Once this text appears in the terminal or command prompt:
     ``` --
    AAW | Association for Academic Women at the University of Florida - Development Environment
    Environment:                        development
    Port:                               3000
    Database:                           mongodb://{user}:{password}@ds157444.mlab.com:57444/aaw_db
    App version:                        0.4.2
    MEAN.JS version:                    0.4.2
    -- 
  The website is now viewable at localhost:3000 in a web browser.
  
  Changes to the project may also be done while the command prompt/terminal is running the localhost. The website will automatically refresh to reflect new changes.
		
		
		
## Outside contributions

A tool called ICAL was used to parse an .ics file to get the list of upcoming events on the calendar page.  The repo for ICAL is here: https://github.com/mozilla-comm/ical.js/

Heroku's file upload tutorial was used to implement file uploading in the profiles and pendingrequet controllers. https://devcenter.heroku.com/articles/s3-upload-node

The top answer in this Stack Overflow question was used to implement the month filter in the calendar and home client controllers: https://stackoverflow.com/questions/21480359/angularjs-show-name-of-the-month-given-the-month-number

## Project Features

### Home Page

![Home Page](screenshots/home.png?raw=true "Home Page")

### About Page

![Home Page](screenshots/about.png?raw=true "About Page")
Note that the side menu appears extra times due to the screenshot. It is only present once on the screen.

### Madelyn Page

![Madelyn Page](screenshots/madelyn.png?raw=true "Madelyn Page")

### Distinction Page

![Distinction Page](screenshots/distinction.png?raw=true "Distinction Page")

### Calendar Page

![Calendar Page](screenshots/calendars.png?raw=true "Calendar Page")

### News Page

![News Page](screenshots/news.png?raw=true "News Page")

### Profiles Page

![Profiles Page](screenshots/profiles.png?raw=true "Profiles Page")

### Join Page

![Join Page](screenshots/join.png?raw=true "Join Page")


### Join Form

![Join Form](screenshots/joinform.png?raw=true "Join Form")


### Join Form Public

![Join Form Public](screenshots/joinformpublic.png?raw=true "Join Form Public")

### Admin Views

#### Modal

![Modal](screenshots/modal.jpg?raw=true "Modal")
Each edit button causes a modal similar to this to appear. The text is editable.

#### List News

![List News](screenshots/listnews.png?raw=true "List News")

#### Application List

![Application List](screenshots/listapplications.png?raw=true "Application List")

#### Application Individual List

![Application Individual List](screenshots/applicationlist.png?raw=true "Application Individual List")
