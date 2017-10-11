import React from 'react'
import * as BooksAPI from './BooksAPI'

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

export default BookView
