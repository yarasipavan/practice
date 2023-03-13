## Project Name: WAL Pulse

## Description:

- This product will serve as tracking tool for projects and portfolio for each GDO and overall organisation.


## Users in the projects

- SUPER ADMIN
- ADMIN USER
- GDO HEAD
- PROJECT MANAGER

---


## ROLES


### Super Admin

- get the user details who are registered to this portal
- assign / update the role to the registered users
- update user details
- delete the regitered employee -(soft delete)

### Admin User

- get the project portfolio
  -> details of all projects in the organization
  -> get the detailed view of each project
  _ fitness of the project, concern indicators,team size
  _ project details in detail
  _ project updates( last 2 weeks)
  _ project concerns
  \_ Team composition of the project

- get all concerns of all projects
- create / add new project
- update project details
- get resource requests raised by GDO head

### GDO Head

- get the project portfolio which are under his/her supervision
  -> details of all projects in the organization
  -> get the detailed view of each project which is under his/her supervision
  _ fitness of the project, concern indicators,team size
  _ project details in detail
  _ project updates( last 2 weeks)
  _ project concerns
  \_ Team composition of the project
- get all concerns of all projects which are under his/her supervision
- assign employees to projects which are under his/her supervision
- update employee details who are working in the projects which are under his/her supervision
- remove employees from the projects which are under his/her supervision( soft delete {status-inactive})
- Raise resource requests raised by GDO head

### Project - manager

- get the project portfolio which are under his/her supervision
  -> details of all projects in the organization
  -> get the detailed view of each project which is under his/her supervision
  _ fitness of the project, concern indicators,team size
  _ project details in detail
  _ project updates( last 2 weeks)
  _ project concerns
  \_ Team composition of the project
- get all concerns of all projects which are under his/her supervision
- raise concerns for a projects which are under his/her supervision
- post the project updates


## Pre requirements


- to run this project , we must have nodejs and npm in our system
- we need to have details of all employees in the table employee (emp_id,emp_mail,name)
- configure .env file
- create .env file in the folder
  - keep the following values

    - DB_NAME=database_name
    - DB_USER=root
    - DB_PASSWORD=database password
    - DB_PORT=3306
    - PORT=4000 // port number to listen the requests
    - TOKEN_SECRET_KEY=hvdhcbsbnakvdhsbcskdjnmcdsdsjds // secret key for encryption
    - from_mail=abc@gmail.com // mail address to send the mails
    - app_password=qqwweerrttyy1122 // mail app password of the above mail
    - CLIENT_URL=http://localhost:4000 // this is the url of this portal (this is for reset password link)

- install all node modules which are used in this project by below command
    ```
    npm install
    ```

- start the server using below command
    ```
    npm start
    ```
