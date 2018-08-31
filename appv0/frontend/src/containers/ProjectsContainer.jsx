import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Container, Row, Col, Card, CardBody, CardTitle, CardSubtitle,
} from 'reactstrap';

import { startFetchProjects } from '../actions';

/* eslint-disable react/destructuring-assignment */

const ProjectRow = ({ project }) => (
  <Row>
    <Col>
      <Card>
        <CardBody>
          <CardTitle>
            <Link to={`projects/${project.id}`}>
              {project.name}
            </Link>
          </CardTitle>
          <CardSubtitle>
            {project.path}
          </CardSubtitle>
        </CardBody>
      </Card>
    </Col>
  </Row>
);

ProjectRow.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
  }).isRequired,
};

class ProjectsContainer extends React.Component {
  componentDidMount() {
    this.props.startFetchProjects();
  }

  render() {
    const { projects } = this.props;

    return (
      <Container fluid>
        <Row>
          <Col sm={10} lg={8}>
            <h2>Projects</h2>
            <Container fluid>
              {
                projects.map((project) => (
                  <ProjectRow project={project} />
                ))
              }
            </Container>
          </Col>
        </Row>
      </Container>
    );
  }
}

ProjectsContainer.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.any).isRequired,
  startFetchProjects: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  projects: state.projects,
});

export default connect(mapStateToProps, {
  startFetchProjects,
})(ProjectsContainer);
