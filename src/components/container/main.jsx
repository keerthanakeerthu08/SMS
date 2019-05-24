import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Row, Container } from 'reactstrap';

import Header from 'components/common/header';
import SideNav from 'components/common/sideNav';

// Services
import Service from 'services/service';

// Route
import Dashboard from './dashboard/dashboard';
import Settings from './settings/settings';
import FeeAllocation from './fees/feeAllocation';
import FeeCollection from './fees/feeCollection';
import AddAssignment from './assignment/addAssignment';
import ViewAssignment from './assignment/viewAssignment';
import HomeWork from './assignment/homeWork';
import ViewHomeWork from './assignment/viewHomeWork';

/* import Details from './user/userlist'; */
import Login from './user/form/form-register';
import Personal from './user/personal';
import Communication from './user/communication';
import Education from './user/education';
import Extracurricular from './user/extracurricular';
import Organization from './user/organization';
import Parent from './user/parent';

import AddRoles from './roles/addRoles';


import AddExam from './exam/addExam';
import ViewExam from './exam/viewExam';
import ViewQuestion from './exam/viewQuestion';
import ViewSection from './exam/viewSection';
import AddCourse from './course/addCourse';
import AddSubject from './course/addSubject';
import AddLesson from './course/addLesson';
import CourseDetails from './course/courseDetails';
import SubjectDetails from './course/subjectDetails';
import LessonDetails from './course/lessonDetails';
import AddSchedule from './schedule/addSchedule';
import ViewSchedule from './schedule/viewSchedule';
import ViewEventDetails from './schedule/viewEventDetails';

import ClientCrdentials from './clientCredentials/clientCredentials';
import AddClient from './client/addClient';
import ViewClient from './client/viewClient';
import viewClientDetails from './client/viewClientDetails'
import AddAttendance from './attendance/addAttendance';
import ViewAttendance from './attendance/viewAttendance';
import AddHolidays from './attendance/addHolidays';
import StaffAllocation from './attendance/staffAllocation';
import AssignmentReports from './reports/assignmentReports';
import AttendanceReports from './reports/attendanceReports';
import EventsReports from './reports/eventsReports';
import ExamReports from './reports/examReports';
import FeeDetailsReports from './reports/feedetailsReports';
import StudentTimetable from './timetable/studentTimetable';
import StaffTimetable from './timetable/staffTimetable';
import ReSchedule from './timetable/reschedule';
import FreestaffTimetable from './timetable/freestaffTimetable';

import './style.scss';

// var $ = require('jquery');

export default class main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loginData: {}
    }
    this.checkLoggedIn = this.checkLoggedIn.bind(this);
  }

  componentDidMount() {
    this.checkLoggedIn();
  }

  checkLoggedIn() {
    Service.getStoredValue((res) => {
    
      if (res.isLoggedIn) return this.setState({ loginData: res });
      sessionStorage.clear();
      return this.props.history.push('/');
    });
  }


  render() {
    return (
      <Container fluid className="pl-0 px-0">

        <Header />
        <Row className="ml-0 mx-0">
          <div className="sidbardiv">
            <SideNav />
          </div>
          <div className="maincontentdiv">
            <Router>
              <Switch>
                <Route exact path="/main/dashboard" component={Dashboard} />
                <Route path="/main/settings" component={Settings} />



                <Route path="/main/:type/:clientId/personal" component={Personal} />

                <Route path="/main/personal" component={Personal} />
                <Route path="/main/:uid/personal" component={Personal} />
                <Route path="/main/communication" component={Communication} />
                <Route path="/main/education" component={Education} />
                <Route path="/main/extracurricular" component={Extracurricular} />
                <Route path="/main/organization" component={Organization} />
                <Route path="/main/parent" component={Parent} />


                <Route path="/main/add_exam" component={AddExam} />
                <Route path="/main/view_exam" component={ViewExam} />
                <Route path="/main/view_question" component={ViewQuestion} />
                <Route path="/main/view_section" component={ViewSection} />

                <Route path="/main/addAssignment" component={AddAssignment} />
                <Route path="/main/viewAssignment" component={ViewAssignment} />
                <Route path="/main/homework" component={HomeWork} />
                <Route path="/main/viewHomeWork" component={ViewHomeWork} />


                <Route path="/main/client_credentials" component={ClientCrdentials} />

                <Route path="/main/fee_allocation" component={FeeAllocation} />
                <Route path="/main/fee_collection" component={FeeCollection} />

                <Route path="/main/add_course" component={AddCourse} />
                <Route path="/main/add_subject" component={AddSubject} />
                <Route path="/main/add_lesson" component={AddLesson} />
                <Route path="/main/viewlesson_details" component={LessonDetails} />
                <Route path="/main/viewsubject_details" component={SubjectDetails} />
                <Route path="/main/viewcourse_details" component={CourseDetails} />

                <Route path="/main/add_schedule" component={AddSchedule} />
                <Route path="/main/view_schedule" component={ViewSchedule} />
                <Route path="/main/view_event_details" component={ViewEventDetails} />

                <Route path="/main/add-client" component={AddClient} />
                <Route path="/main/view-client" component={ViewClient} />
                <Route path="/main/view-client-details" component={viewClientDetails} />

                <Route path="/main/add_attendance" component={AddAttendance} />
                <Route path="/main/view_attendance" component={ViewAttendance} />
                <Route path="/main/add_holidays" component={AddHolidays} />
                <Route path="/main/staff_allocation" component={StaffAllocation} />

                <Route path="/main/client_credentials" component={ClientCrdentials} />

                <Route path="/main/assignment_reports" component={AssignmentReports} />
                <Route path="/main/attendance_reports" component={AttendanceReports} />
                <Route path="/main/event_reports" component={EventsReports} />
                <Route path="/main/exam_reports" component={ExamReports} />
                <Route path="/main/fee_reports" component={FeeDetailsReports} />

                <Route path="/main/student_timetable" component={StudentTimetable} />
                <Route path="/main/staff_timetable" component={StaffTimetable} />
                <Route path="/main/freestaff_timetable" component={FreestaffTimetable} />
                <Route path="/main/reschedule" component={ReSchedule} />

                <Route path="/main/add_roles" component={AddRoles} />
              </Switch>
            </Router>
            {/* </Col> */}
          </div>
        </Row>
      </Container >
    );
  }
}

