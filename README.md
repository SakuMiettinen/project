The project is using a minimal setup so it only uses Node.js on the backend with express.js and MongoDB as the database and no frontend frameworks are used.

The project gets the users kanban data from the database and sets the initial state of the board based on it and stores it in a local array that is used as temporary storage. (Should not have done this but time constraint caused me to stick with this). User data from the local array is saved to the database every time the user:

-   Adds or removes a column
-   Adds or removes a card
-   Modifies any text

Usage:
For a local copy of the project:
npm i
npm run dev

IMPORTANT
the project requires a .env file with atleast a 'SECRET' field for example:
SECRET=secretkey

Other fields used are optional:
PORT (localhost port number)
DB (MongoDB database string)

If no PORT is used the server will run on http://localhost:3000/

Points proposal:
25 points

All the basic minimum requirement functionality is implemented.

-   The application is made with Node and express and doesn't use any other languages.
-   A database is implemented in the form of MongoDB and all data is stored in the database
-   The user can:

    -   Add/remove/rename columns to/of their own board:
        -   Adding is done by clicking the Add new column button
        -   Removal is done by clicking the X button on the top right of any column
        -   Renaming is done by double-clicking the column text and saved by clicking off or pressing 'Enter'
    -   Add/move/remove cards on/of their own board:
        -   Adding is done by clicking the Add new card button in any column
        -   Moving is done by using the buttons positioned at the bottom of each card.
        -   Removal is done by clicking the X button on the top right of any card
    -   Cards should be movable to both up and down and between columns:
        -   Mentioned before

-   Unauthenticated users are able to register and login using the login and register pages and are not able to view the Kanban board page.

-   The app is usable on both mobile and desktop devices

Declaration of AI usage:

-   ChatGPT was the only AI-system used in the production of the project:
    -   ChatGPT was used for the following:
        -   "Googling" such as what different functions can be used for a certain task such as splice, findIndex and reduce
        -   Design choises such as: How to store data. When to save data to database.
