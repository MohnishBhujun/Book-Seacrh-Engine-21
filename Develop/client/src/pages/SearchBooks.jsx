import { useState } from "react";
import { Container, Col, Form, Button, Card, Row } from "react-bootstrap";
import Auth from "../utils/auth";
import { searchGoogleBooks } from "../utils/API";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_BOOK } from "../graphql/mutation";
import { GET_USER_BOOKS_ID } from "../graphql/query";

const SearchBooks = () => {
  const { loading, data, refetch } = useQuery(GET_USER_BOOKS_ID);
  const [saveBook] = useMutation(ADD_BOOK);

  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ["No author to display"],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || "",
      }));

      setSearchedBooks(bookData);
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveBook = async (bookId) => {
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
    try {
      await saveBook({ variables: { bookData: bookToSave } });
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a book"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className="pt-5 mb-5">
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : "Search for a book to begin"}
        </h2>
        <Row className="pb-5">
          {searchedBooks.map((book) => {
            return (
              <Col md="4" className="mb-3" key={book.bookId}>
                <Card border="dark">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={data.getUserBooks?.some(
                          (item) => item.bookId === book.bookId
                        )}
                        className="btn-block btn-info"
                        onClick={() => handleSaveBook(book.bookId)}
                      >
                        {data.getUserBooks?.some(
                          (item) => item.bookId === book.bookId
                        )
                          ? "This book has already been saved!"
                          : "Save this Book!"}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;
