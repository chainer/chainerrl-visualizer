import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Container, Row, Col, Card, CardTitle, CardSubtitle,
} from 'reactstrap';
import { Link } from 'react-router-dom';

import { startFetchProjects } from '../actions';

class ProjectsContainer extends React.Component {
  componentDidMount() {
    this.props.startFetchProjects(); /* eslint-disable-line react/destructuring-assignment */
  }

  render() {
    const { projects } = this.props;

    return (
      <div>
        <Container fluid>
          <Row>
            <Col sm={10} lg={8}>
              <h2>Projects</h2>
              <Container fluid>
                {
                  projects.map((project) => (
                    <Row>
                      <Col>
                        <Card>
                          <CardTitle>
                            <Link to={`projects/${project.id}`}>
                              {project.name}
                            </Link>
                          </CardTitle>
                          <CardSubtitle>
                            {project.path}
                          </CardSubtitle>
                        </Card>
                      </Col>
                    </Row>
                  ))
                }
              </Container>
            </Col>
          </Row>
        </Container>
      </div>
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
