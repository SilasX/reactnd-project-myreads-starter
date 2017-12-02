import React from 'react'
import { Link, Route } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import BookView from './BookView'
import './App.css'


class BooksApp extends React.Component {

  // status = want to read, read, etc
  constructor(props) {
    super(props)
    this.state = {
      currentlyReading: [],
      wantToRead: [],
      read: [],
      query: "",
      searchResults: []
    }
    this.moveHandler = this.moveHandler.bind(this)
  }

  componentDidMount() {
    BooksAPI.getAll().then((books) =>
    this.setState(
      { bookVals: books }
    )).then(() => (
      this.updateBookCategories()
    ))
  }

  updateBookCategories() {
    /**
    * @description from the master state.bookVals list, populates the
    * different categories based on what their .shelf properies say
    * they should be
    */
    this.setState((state) => ({
      wantToRead: state.bookVals.filter(
        (book) => "wantToRead" === book.shelf),
      currentlyReading: state.bookVals.filter((book) =>
        "currentlyReading" === book.shelf),
      read: state.bookVals.filter((book) => "read" === book.shelf)
      }),
      this.updateSearchResults
    )
  }

  moveHandler(changedBook, oldCategory, newCategory) {
    /**
    * @description General handler for moving a book from one category
    * to another: it adds the book to the .bookVals list or updates
    * its .shelf in that list, propagates the results over to the search
    * state, and then calls updateBookCategories() to make the books
    * appear in their relevant categories.
    * @param {book} changedBook - Book object to be recategorized
    * @param {string} oldCategory - Previous category book was in
    * @param {string} newCategory - New category book should be moved
    *   into
    */
    this.setState(
      (prevState, state) => {
        // If it's not in our bookVals list, just append it on
        if (oldCategory === "none") {
          return {
            bookVals: prevState.bookVals.concat([{
              ...changedBook, shelf: newCategory
            }])
          }
        } else {
          // Otherwise map over the .bookVals and replace the book
          // with one whose .shelf has the new category
          return {
            bookVals: prevState.bookVals.map((book) =>
              (book.id === changedBook.id)
                ? {...book, shelf: newCategory}
                : {...book}
            )
          }
        }
      },
      () => this.setState( (prevState) => ({
        // Propagate changes to search results
        searchResults: prevState.searchResults.map( (searchResult) => {
          // get the occurrences of the book in this.bookVals
          const matches = prevState.bookVals.filter((bookVal) =>
            searchResult.id === bookVal.id)
          // if it's in the list, use that category, otherwise
          // leave it unchanged
          if (matches.length === 0) {
            return {...searchResult, shelf: "none"}
          } else {
            return {...searchResult, shelf: matches[0].shelf}
          }
        })
      }), this.updateBookCategories)
    )
  }

  doSearch() {
    BooksAPI.search(this.state.query, 20)
    .then((books) => {
      // Do nothing if search returns an error
      if (books.hasOwnProperty('error')) {
        return
      }
      this.setState( (prevState) => ({
        searchResults: books.map( (book) => {
          // get the occurrences of the book in this.bookVals
          const matches = prevState.bookVals.filter((bookVal) => 
            book.id === bookVal.id)
          // if it's in the list, use that category, otherwise
          // leave it unchanged
          if (matches.length === 0) {
            return {...book, shelf: "none"}
          } else {
            return {...book, shelf: matches[0].shelf}
          }
        })
      }))
    })
  }

  updateQuery(query) {
    this.setState({ query: query }, this.doSearch)
  }

  render() {
    return (
      <div className="app">
        <Route exact path="/search" render={() => (
          <div className="search-books">
            <div className="search-books-bar">
              <Link className="close-search" to="/">Close</Link>
              <div className="search-books-input-wrapper">
                <input
                  type="text"
                  placeholder="Search by title or author"
                  value={this.state.query}
                  onChange={(event) => this.updateQuery(event.target.value)}
                />
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
                { this.state.searchResults.map((book) => (
                    <BookView
                      book={book}
                      key={book.id}
                      moveHandler={this.moveHandler}
                    />
                ))}
              </ol>
            </div>
          </div>
        )}/>
        <Route exact path="/" render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Currently Reading</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                        { this.state.currentlyReading.map((book) => (
                            <BookView
                              book={book}
                              key={book.id}
                              moveHandler={this.moveHandler}
                            />
                        ))}
                    </ol>
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Want to Read</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                        { this.state.wantToRead.map((book) => (
                            <BookView
                              book={book}
                              key={book.id}
                              moveHandler={this.moveHandler}
                            />
                        ))}
                    </ol>
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Read</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                        { this.state.read.map((book) => (
                            <BookView
                              book={book}
                              key={book.id}
                              moveHandler={this.moveHandler}
                            />
                        ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="open-search">
              <Link to="/search">Add a book</Link>
            </div>
          </div>
        )}/>
      </div>
    )
  }
}

export default BooksApp
