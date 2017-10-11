import React from 'react'
import { Link, Route } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import './App.css'

class BookView extends React.Component {

  constructor(props) {
    super(props)
    var thumbnail = "/favicon.ico"  // default thumbnail value
    if (typeof props.book.imageLinks !== "undefined") {
        thumbnail = props.book.imageLinks.thumbnail
    }
    this.state = {
      value: this.props.book.shelf,
      thumbnail: thumbnail
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    const newValue = event.target.value
    // local update
    this.setState({value: newValue}, () =>
      // Then trigger the category mover on the main screen
      this.props.moveHandler(
        this.props.book,
        this.props.book.shelf,
        newValue
      )
    )
    BooksAPI.update(this.props.book, newValue)
  }

  render() {
    const book = this.props.book
    return (
      <li>
        <div className="book">
          <div className="book-top">
              <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${this.state.thumbnail})` }}>></div>
            <div className="book-shelf-changer">
              <select value={this.state.value} onChange={this.handleChange}>
                <option value="placeholder" disabled>Move to...</option>
                <option value="currentlyReading">Currently Reading</option>
                <option value="wantToRead">Want to Read</option>
                <option value="read">Read</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>
          <div className="book-title">{book.title}</div>
          <div className="book-authors">{book.authors}</div>
        </div>
      </li>
    )
  }
}

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
    //this.updateSearchResults = this.updateSearchResults.bind(this)
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

  moveHandler(changed_book, oldCategory, newCategory) {
    this.setState(
      (prevState, state) => {
        // If it's not in our bookVals list, just append it on
        if (oldCategory === "none") {
          return {
            bookVals: prevState.bookVals.concat([{
              ...changed_book, shelf: newCategory
            }])
          }
        } else {
          // Otherwise find the book by its id and map it over to one with
          // the new value of shelf
          return {
            bookVals: prevState.bookVals.map((book) =>
              (book.id === changed_book.id) ? {...book, shelf: newCategory}
              : {...book}
            )
          }
        }
      },
      () => this.setState( (prevState) => ({
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
    .then((books) =>
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
    ).catch(() => this.setState({}))
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
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
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
