import React, { Component } from 'react';
import 'styles/App.scss';
import { NavLink } from 'react-router-dom';
import { Col, Row,  } from 'reactstrap';
export default class DashboardItem extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    render() {
        const {  title, value,  className,iconclass,icon } = this.props
        return (
            <NavLink to='dashboard'>
              
                <div className={className} >
                    <h5>{title}</h5>
                    <Row>
                        <Col sm={6}>
                            <p>{value}</p>
                        </Col>
                        <Col sm={6}>
                            <div className={iconclass}>
                                <i className={icon} aria-hidden="true"></i>
                            </div>
                        </Col>
                    </Row>
                </div>
            </NavLink>
        )
    }
} 