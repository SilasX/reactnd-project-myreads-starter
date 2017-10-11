# MyReads App

This app allows you to keep track of books you have read, are currently reading, or want to read. To change the book's category at the root (path: `/`), simply click on the green circle over the book's picture and choose a different category.

You can also search for new books and add them to a category on the search page, at `/search`.

## Usage

To run this app:

* Ensure you have a working internet connection and your computer is not serving anything on port 3000
* Run `npm install` or `yarn install`.
* Run `npm start` or `yarn start`.
* Access the app at http://localhost:3000 .

## Components

To be added.

## Backend Server

This app uses a backend server hardcoded into the source, and your browser will automatically send the right key to identify you for the backend, as long as you don't delete cookies.

The provided file [`BooksAPI.js`](src/BooksAPI.js) contains the methods you will need to perform necessary operations on the backend:

* [`getAll`](#getall)
* [`update`](#update)
* [`search`](#search)

### `getAll`

Method Signature:

```js
getAll()
```

* Returns a Promise which resolves to a JSON object containing a collection of book objects.
* This collection represents the books currently in the bookshelves in your app.

### `update`

Method Signature:

```js
update(book, shelf)
```

* book: `<Object>` containing at minimum an `id` attribute
* shelf: `<String>` contains one of ["wantToRead", "currentlyReading", "read"]  
* Returns a Promise which resolves to a JSON object containing the response data of the POST request

### `search`

Method Signature:

```js
search(query, maxResults)
```

* query: `<String>`
* maxResults: `<Integer>` Due to the nature of the backend server, search results are capped at 20, even if this is set higher.
* Returns a Promise which resolves to a JSON object containing a collection of book objects.
* These books do not know which shelf they are on. They are raw results only. You'll need to make sure that books have the correct state while on the search page.

## Important
The backend API uses a fixed set of cached search results and is limited to a particular set of search terms, which can be found in [SEARCH_TERMS.md](SEARCH_TERMS.md). That list of terms are the _only_ terms that will work with the backend, so don't be surprised if your searches for Basket Weaving or Bubble Wrap don't come back with any results.

