# seng
Software Engineering Repository

This project has been done using django

How to start your own django project?
1) install django
2) navigate to the desired directory via the command line
3) with "django-admin startproject your_name" you can start your own project
4) with "django-admin startapp core you initialize the contents we need for the web app

Running the app (using Anaconda Powershell)
1) with "python manage.py runserver" the project is executed and you get a url that you can copy into your browser to navigate the project
2) if you make changes to the models.py file (that was created when you started the app) you always need to make the migrations:
3) "conda manage.py makemigrations"
4) "conda manage.py migrate"

- to create an admin you can use tbd
- 