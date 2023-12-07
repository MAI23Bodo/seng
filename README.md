# seng
Social Hub - Software Engineering 2023 Repository

To start the project make sure to properly setup the project:

Server:
    - open a terminal and change directory to BackEnd/social-hub
    - activate a python environment
    - install dependencies:
        
    python -m pip install --upgrade pip
    pip install --upgrade django djangorestframework
    pip install --upgrade django-cors-headers

    - to start the server type in following command:

    python manage.py runserver

    or

    run InitBackend.bat

    - to run the tests, user following command:

    python manage.py test

Client:
    - open a terminal and change directory to FrontEnd/social-hub
    - install dependencies (tested with Node 18.0.0 and npm 8.6.0):

    npm install axios

    - to start the client, use following command:

    npm run dev

    or

    run InitFrontend.bat

Application:
    - to start the whole application at once, you can execute InitApp.bat (make sure to install all dependencies first!)