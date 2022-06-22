# kasper-backend
This is API part of assignment to show Peoples table with CRUD operations and reordering rows;
Stack was expected to be REACT/NODE/TS/MYSQL

SQL script required for App: /src/scripts/create_schema.sql

add .env file at root with below values:
PORT=8000
MY_SQL_DB_HOST=
MY_SQL_DB_USER=
MY_SQL_DB_PASSWORD=
MY_SQL_DB_PORT=
MY_SQL_DB_DATABASE=
MY_SQL_DB_CONNECTION_LIMIT=


## Setup App locally

### Requirements
NPM, Node, Mysql

### clone 
git@github.com:vi8l/kasper-backend.git

run `npm i` to install dependencies 
## scripts 

In the project directory, you can run:

### `npm run test`

Runs the test cases locally.\
You can also check the detailed report in coverage folder.
If you open the index.html in the browser then you will get the result for each file code coverage.

### `npm run start`

Runs the app locally in the development mode.\
Open [http://localhost:8000](http://localhost:8000) to view it in the browser.

### `npm run dev`

Runs the app locally in the development mode.\ using nodemon & concurrently 
Open [http://localhost:8000](http://localhost:8000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Compile TS to JS into the `dist` folder.\

