import React from 'react';
import {
  Container, Spinner, ListGroup,
} from 'react-bootstrap';

export default function TronExtensionChecker() {
  return (
    <Container className="my-3">
      <h2 className="text-center">
        Loading...
        <Spinner animation="border" />
      </h2>
      <ListGroup as="ol" numbered>
        <ListGroup.Item as="li">Check if TronLink is enabled...</ListGroup.Item>
        <ListGroup.Item as="li">Check if you are logged into...</ListGroup.Item>
        {/* <ListGroup.Item as="li">Finally just reload the page...</ListGroup.Item> */}
      </ListGroup>

    </Container>
  );
}
