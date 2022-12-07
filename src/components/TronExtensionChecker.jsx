import React from 'react';
import {
  Container, Spinner, ListGroup, Accordion,
} from 'react-bootstrap';

export default function TronExtensionChecker() {
  return (
    <Container className="my-3">
      <h2>
        Loading...
        <Spinner animation="border" />
      </h2>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Panic? Here are some hints</Accordion.Header>
          <Accordion.Body>
            <ListGroup as="ol" numbered>
              <ListGroup.Item as="li">Check if TronLink is enabled...</ListGroup.Item>
              <ListGroup.Item as="li">Check if you are logged into...</ListGroup.Item>
              <ListGroup.Item as="li">Finally just reload the page...</ListGroup.Item>
            </ListGroup>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

    </Container>
  );
}
