# Matcha
**First Project using ReactJs/ExpressJs**
# About
A web app allowing two potential lovers to meet, from the registration to the final encounter.
A user will be able to register, connect, fill his/her profile, search and look intothe profile of other users, like them 1, chat with those that “liked” back.

# Configuration
Create ```_Database/config/dev.json``` contain:
```
{
  "dev": {
    "host": ,
    "database": ,
    "user": ,
    "password": ,
    "driver": "mysql",
    "multipleStatments": true
  },
  "sql-file": true
}
```
Create ```config/dev.json``` contain:
```
{
  "database": {
    "user": "root",
    "password": "159357",
    "host": "localhost",
    "database": "matcha"
  },
  "keyOrSecret": "1337matcha",
  "url": "localhost:5000",
  "uploadPath": "./client/build"
}
```
# Set up

Here's the technical stack this project was made with:

# Front end

- React
- ContextApi
- React-socket-io
- MaterialUi

# Back end

- Express
- MySQL
- Socket.io

# Run
Modules: ```npm i && cd client npm i```
Db : ```cd _Database && db-migrate up --config ./config/dev.json```
Run: ```npm run build```

# View
**Landing Page:**

<img width="2560" alt="1" src="https://user-images.githubusercontent.com/43388336/71451184-06608d00-2771-11ea-9ac6-f623a6238b60.png">

**Browse (Suggestions):**

<img width="2548" alt="4" src="https://user-images.githubusercontent.com/43388336/71451203-5ccdcb80-2771-11ea-8805-832dbb23b3f6.png">

**Profile:**

<img width="1350" alt="5" src="https://user-images.githubusercontent.com/43388336/71451204-5ccdcb80-2771-11ea-8afe-7ab8d291084c.png">

**Notifications:**

<img width="679" alt="6" src="https://user-images.githubusercontent.com/43388336/71451205-5ccdcb80-2771-11ea-98b0-1af731e00ed5.png">

**Edit Profile:**
<img width="1044" alt="8" src="https://user-images.githubusercontent.com/43388336/71451207-5d666200-2771-11ea-86b0-da7ad440a0db.png">

<img width="922" alt="9" src="https://user-images.githubusercontent.com/43388336/71451208-5d666200-2771-11ea-96b7-8b48c053f730.png">

# By:
- abelomar
- fdrissi
