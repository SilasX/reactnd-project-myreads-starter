import React from 'react'
import { Link, Route } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import './App.css'

class BookView extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      value: this.props.book.shelf
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    //const oldValue = this.state.value
    const newValue = event.target.value
    // local update
    this.setState({value: newValue})
    .then(
      this.props.moveHandler(
        this.props.book.id,
        this.props.book.shelf,
        newValue
    ))
    .then(
      BooksAPI.update(this.props.book, newValue)
    )
  }

  render() {
    const book = this.props.book
    return (
      <li>
        <div className="book">
          <div className="book-top">
            <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}>></div>
            <div className="book-shelf-changer">
              <select value={this.state.value} onChange={this.handleChange}>
                <option value="none" disabled>Move to...</option>
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
    return this.setState((state) => ({
      wantToRead: this.state.bookVals.filter(
        (book) => "wantToRead" === book.shelf),
      currentlyReading: this.state.bookVals.filter((book) =>
        "currentlyReading" === book.shelf),
      read: this.state.bookVals.filter((book) => "read" === book.shelf)
    }))
  }

  moveHandler(book_id, oldCategory, newCategory) {
    this.setState(
      (prevState, state) => {return {
        bookVals: prevState.bookVals.map((book) =>
          (book.id === book_id) ? {...book, shelf: newCategory}
          : {...book}
        )
      }},
      this.updateBookCategories
    )
      /*// assume that the book is in the oldCategory
    console.log(this.state)
    console.log(book_id)
    console.log(oldCategory)
    const matches = this.state[oldCategory].filter(
      (book) => book.id === book_id
    )
    // Just exit if no match
    if (matches.length === 0) {
      return
    }
    const movingBook = matches[0]
    // Create list for the new cateogry: everything there, plus
    // book to be moved
    const newCateogryList = this.state[newCategory].concat([movingBook])
    // Create list for the old cateogry: everything there, minus
    // book to be moved
    const oldCategoryList = this.state.filter( (book) =>
      book.id !== book_id
    )
    // Set those lists in place of the current state:
    const newState = {}
    newState[newCategory] = newCateogryList
    newState[oldCategory] = oldCategoryList
    console.log(newState)
    return this.setState((state) => newState)*/


  }

  testHandle() {
    console.log("got your click")
  }

  doSearch() {
    BooksAPI.search(this.state.query, 20)
    .then((books) =>
      this.setState({
        searchResults: books
      })
    ).catch(() =>
      this.setState({
        searchResults: []
      })
    )
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
