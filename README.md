<h1 align="center">Foodfy</h1>

<p align="center">Using html, css and javascript to build a complete website for recipe company named Foodfy.</p>

<div align="center">
  <img src="https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/mockup.png" />
</div>

## :computer: Built With
- [Node.js](https://nodejs.org/en/)
- [PostgreSQL](https://www.postgresql.org/)
- [Nunjucks](https://mozilla.github.io/nunjucks/)

## :arrow_forward: Getting Started
You need the following tools installed in order to run this project: [Git](https://git-scm.com/), [Node.js](https://nodejs.org/en/), [PostgreSQL](https://www.postgresql.org/) and [Postbird](https://www.electronjs.org/apps/postbird).

1. Clone this repository by running: <br> `git clone https://github.com/caiquegiovannini/foodfy.git`;
2. Enter the folder running through the terminal: <br> `cd foodfy`;
3. Run `npm install` to install the project dependencies;
4. Set up database and mailer access with your credentials at <br> `src/config/db.js` <br> and <br> `src/lib/mailer.js`;
5. Copy all the content found at `database.sql` file and run as a query at postbird to create the database himself;
6. Populate database with users, chefs and recipes running: <br> `node seed.js`;
7. Run `npm start` to start the development server.

## :key: Administrative Area
To get into the administrative area, access `http://localhost:3000/admin`.
You will need to copy a user e-mail from the table 'users' and enter the default password '123'.

## :memo: License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.