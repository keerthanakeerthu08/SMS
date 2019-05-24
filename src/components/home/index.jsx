
import React, { Fragment } from 'react';
import 'styles/Home.scss';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  
  UncontrolledCarousel,
  Modal, ModalHeader, ModalBody, 
} from 'reactstrap';

const items = [
  {
    src: 'http://globalacademy.lk/wp-content/uploads/2018/04/highschool-student-sitting-on-a-bench.jpg',
    altText: '',
    caption: '',
    header: ''
  },
  {
    src: 'http://globalacademy.lk/wp-content/uploads/2018/04/highschool-student-sitting-on-a-bench.jpg',
    altText: '',
    caption: '',
    header: ''
  },
  {
    src: 'http://globalacademy.lk/wp-content/uploads/2018/04/highschool-student-sitting-on-a-bench.jpg',
    altText: '',
    caption: '',
    header: ''
  }
];

const screenshots = [
  {
    src: '/assets/images/screen3.png',
    altText: '',
    caption: '',
    header: ''
  },
  {
    src: '/assets/images/screen1.png',
    altText: '',
    caption: '',
    header: ''
  },
  {
    src: '/assets/images/screen2.png',
    altText: '',
    caption: '',
    header: ''
  },
  {
    src: '/assets/images/screen4.png',
    altText: '',
    caption: '',
    header: ''
  },
  {
    src: '/assets/images/screen5.png',
    altText: '',
    caption: '',
    header: ''
  },
  {
    src: '/assets/images/screen6.png',
    altText: '',
    caption: '',
    header: ''
  },
  {
    src: '/assets/images/screen7.png',
    altText: '',
    caption: '',
    header: ''
  }
];

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.modaltoggle = this.modaltoggle.bind(this);
    this.state = {
      isOpen: false,
      modal: false,
      islogin: false,
    };
  }

  componentDidMount = async () => {
    // let login = localStorage.getItem("login");
    let login = sessionStorage.getItem("login");
    if (login) await this.setState({islogin: true})
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  modaltoggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }
  render() {
    const { islogin } = this.state;
    return (
      <Fragment>
        <div class="homenavbar">
          <Navbar color="light" light className="bgwhite" expand="md">
            <NavbarBrand href="/"><img className="homelogo" alt="" src="https://www.bluewhyte.com/assets/images/school-management-icon.png" /><span className="brandname">School Management System</span></NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>

                <NavItem>
                  {!islogin &&
                    <NavLink className="homeloginbtn" href="/login">Login</NavLink>
                  }
                  {islogin &&
                    <NavLink className="homeloginbtn" href="/dashboard">Dashboard</NavLink>
                  }
                </NavItem>

              </Nav>
            </Collapse>
          </Navbar>
        </div>
        <div>
          <UncontrolledCarousel items={items} />
        </div>
        {/* <div>
          <img className="bannerImg" src="https://cdn-images-1.medium.com/max/2600/1*gOwMfjZn3odOcYdCatiHCw.png" alt="" />

        </div> */}



        <section>
          <div class="container">
            <div class="row">

              <div class="col-md-6 col-sm-6">
                <h5 class="uppercase mb16 text-center"><span className="headstyle">About Us</span></h5>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </div>
              <div class="col-md-6 col-sm-6">
                <img src="/assets/images/screen1.png" alt="" />
              </div>
            </div>
          </div>
        </section>

        <section className="bgwhite">
          <div class="container">
            <div class="row">
              <div class="col-md-6 col-sm-6">
                <img src="/assets/images/screen2.png" alt="" />
              </div>
              <div class="col-md-6 col-sm-6">
                <h5 class="uppercase mb16 text-center"><span className="headstyle">Features</span></h5>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <p>
                  <i className="tickmark">&#10004;</i> Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <p>
                  <i className="tickmark">&#10004;</i> Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <p>
                  <i className="tickmark">&#10004;</i> Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <p>
                  <i className="tickmark">&#10004;</i> Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <p>
                  <i className="tickmark">&#10004;</i>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <p>
                  <i className="tickmark">&#10004;</i> Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="modulessectionbg">
          <div class="container">
            <div><h5 className="uppercase mb16 text-center"><span className="headstyle">Modules</span></h5></div>
            <div class="row">
              <div class="col-md-4 col-sm-6">
                <div class="feature feature-3 mb-xs-24 mb64">
                  <div class="left">
                    <i class="ti-panel icon-sm"></i>
                  </div>
                  <div class="right">
                    <h5 class="uppercase mb16">Settings</h5>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                  </div>
                </div>
              </div>
              <div class="col-md-4 col-sm-6">
                <div class="feature feature-3 mb-xs-24 mb64">
                  <div class="left">
                    <i class="ti-medall icon-sm"></i>
                  </div>
                  <div class="right">
                    <h5 class="uppercase mb16">Users</h5>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4 col-sm-6">
                <div class="feature feature-3 mb-xs-24 mb64">
                  <div class="left">
                    <i class="ti-layout icon-sm"></i>
                  </div>
                  <div class="right">
                    <h5 class="uppercase mb16">Schedule</h5>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4 col-sm-6">
                <div class="feature feature-3 mb-xs-24 mb64">
                  <div class="left">
                    <i class="ti-comment-alt icon-sm"></i>
                  </div>
                  <div class="right">
                    <h5 class="uppercase mb16">Attendance</h5>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                  </div>
                </div>
              </div>
              <div class="col-md-4 col-sm-6">
                <div class="feature feature-3 mb-xs-24">
                  <div class="left">
                    <i class="ti-infinite icon-sm"></i>
                  </div>
                  <div class="right">
                    <h5 class="uppercase mb16">Assignment</h5>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4 col-sm-6">
                <div class="feature feature-3 mb-xs-24">
                  <div class="left">
                    <i class="ti-dashboard icon-sm"></i>
                  </div>
                  <div class="right">
                    <h5 class="uppercase mb16">Reports</h5>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4 col-sm-6">
                <div class="feature feature-3 mb-xs-24 mb64">
                  <div class="left">
                    <i class="ti-id-badge icon-sm"></i>
                  </div>
                  <div class="right">
                    <h5 class="uppercase mb16">Events</h5>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                  </div>
                </div>
              </div>
              <div class="col-md-4 col-sm-6">
                <div class="feature feature-3 mb-xs-24">
                  <div class="left">
                    <i class="ti-list icon-sm"></i>
                  </div>
                  <div class="right">
                    <h5 class="uppercase mb16">Marks</h5>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4 col-sm-6">
                <div class="feature feature-3 mb-xs-24">
                  <div class="left">
                    <i class="ti-info-alt icon-sm"></i>
                  </div>
                  <div class="right">
                    <h5 class="uppercase mb16">Leave</h5>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="screenshotDiv">
          <UncontrolledCarousel items={screenshots} />
        </div>
        <iframe src="https://www.google.com/maps/embed?pb=!1m12!1m8!1m3!1d31132.422813036694!2d77.8108717!3d12.7425675!3m2!1i1024!2i768!4f13.1!2m1!1smap!5e0!3m2!1sen!2sin!4v1556273000032!5m2!1sen!2sin" width="600" height="450" frameborder="0" style={{ "border": 0, "width": "100%" }} allowfullscreen title="Map"></iframe>
        {/* <section className="getintouch-section"> 
           <div class="container">
            <div class="row">
              <div class="col-md-6 col-sm-6">
              </div>
              <div class="col-md-4 col-sm-4">
                <div className="getintouchdiv">
                  <h4>Get in Touch</h4>
                  <div>
                    <div className="inputdiv">
                      <Input type="text" name="name" placeholder="Name" />
                    </div>
                    <div className="inputdiv">
                      <Input type="text" name="email" placeholder="Email" />
                    </div>
                    <div className="inputdiv">
                      <Input type="text" name="phone" placeholder="Phone" />
                    </div>
                    <div className="inputdiv">
                      <Input type="textarea" name="message" rows="6" placeholder="Message" />
                    </div>
                    <div className="text-right">
                      <Button color="primary" size="sm">Send Message</Button>
                    </div>
                  </div>
                </div>

              </div>
              <div class="col-md-2 col-sm-2">
              </div>
            </div>
          </div> 
        </section>*/}

        <section>
          <div class="container">
            <div class="row">
              <div class="col-md-3 col-sm-3">

                <div>
                  <h5 class="uppercase mb16"><i class="ti-map icon-sm icongradient"></i> Address</h5>
                  <p>
                    51, xyz Building, Tower Park, Airport Road, San Fransisco 635126</p>
                </div>
              </div>
              <div class="col-md-3 col-sm-3">
                <div>
                  <h5 class="uppercase mb16"><i class="ti-mobile icon-sm icongradient"></i> Phone</h5>
                  <p>
                    093442 70900
                  <br />
                    Mon-Fri 9:30am - 06:30pm</p>
                </div>
              </div>


              <div class="col-md-3 col-sm-3">
                <div>
                  <h5 class="uppercase mb16"><i class="ti-email icon-sm icongradient"></i> Email</h5>
                  <p>
                    info@school.com
                  <br />
                    24*7 Online Support</p>
                </div>
              </div>
              <div class="col-md-3 col-sm-3">
                <div>
                  <p color="danger" onClick={this.modaltoggle}>Terms & Conditions</p>
                  <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.modaltoggle}>Terms & Conditions</ModalHeader>
                    <ModalBody>

                      <p>
                        <i className="tickmark">&#10004;</i> Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                      <p>
                        <i className="tickmark">&#10004;</i> Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                      <p>
                        <i className="tickmark">&#10004;</i> Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                      <p>
                        <i className="tickmark">&#10004;</i> Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                      <p>
                        <i className="tickmark">&#10004;</i> Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                      <p>
                        <i className="tickmark">&#10004;</i> Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

                    </ModalBody>

                  </Modal>
                </div>
                <div className="socialicons">
                  <i class="ti-twitter icon-sm"></i>
                  <i class="ti-facebook icon-sm"></i>
                  <i class="ti-linkedin icon-sm"></i>
                  <i class="ti-youtube icon-sm"></i>
                  <i class="ti-google icon-sm"></i>
                </div>
              </div>
            </div>

          </div>
        </section>
        <div className="designedbydiv">
          <p>Design and Developed by </p>
        </div>
      </Fragment >
    );
  }
}

export default Home;
