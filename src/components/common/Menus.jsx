import React from 'react';
import * as FAIcons from 'react-icons/fa';

const Menus = {
    "dashboard": { "url": "/dashboard", "icon": <FAIcons.FaLayerGroup />, "text": "Dashboard", "userTypes": ["sadmin", "client", "entity", "student", "staff"], "level": ["client"] },
    "clients": { "url": "/client/list", "icon": <FAIcons.FaUsers />, "text": "Clients", "userTypes": ["sadmin"], "level": ["client"] },
    "setting": { "url": "/settings/department", "icon": <FAIcons.FaCogs />, "text": "Settings", "userTypes": ["sadmin", "admin"], "level": ["client"] },
    "course": { "url": "/course/subject-list", "icon": <FAIcons.FaFileAlt />, "text": "Course", "userTypes": ["sadmin", "admin"], "level": ["client"] },

    "user": { "url": "/users", "icon": <FAIcons.FaUser />, "text": "Users", "userTypes": ["sadmin", "client", "entity"], "level": ["client"] },
    "schedule": { "url": "/schedule/exam", "icon": <FAIcons.FaHourglassHalf />, "text": "Schedule", "userTypes": ["sadmin", "admin"], "level": ["client"] },
    "exam": { "url": "/exam/onlineExam", "icon": <FAIcons.FaBookReader />, "text": "Exam", "userTypes": ["sadmin", "admin"], "level": ["client"] },
    "event": { "url": "/event/addAttendees", "icon": <FAIcons.FaBusinessTime />, "text": "Event", "userTypes": ["sadmin", "admin"], "level": ["client"] },
    "attendance": { "url": "/attendance/attendance", "icon": <FAIcons.FaListAlt />, "text": "Attendance", "userTypes": ["sadmin", "admin"], "level": ["client"] },

    "assignment": { "url": "/assignments/assignment", "icon": <FAIcons.FaClipboardList />, "text": "Assignment", "userTypes": ["sadmin", "admin"], "level": ["client"] },

    "timetable": { "url": "/timetable/exam", "icon": <FAIcons.FaCalendarAlt />, "text": "Timetable", "userTypes": ["sadmin", "admin"], "level": ["client"] },

    "fee": { "url": "/fees/feeallocation", "icon": <FAIcons.FaDollarSign />, "text": "Fees", "userTypes": ["sadmin", "admin"], "level": ["client"] },

    "grade": { "url": "/grade/grade", "icon": <FAIcons.FaPercent />, "text": "Grade Settings", "userTypes": ["sadmin", "admin"], "level": ["client"] },
    "mark": { "url": "/mark/gpa", "icon": <FAIcons.FaJournalWhills />, "text": "Exam Marks", "userTypes": ["sadmin", "admin"], "level": ["client"] },
    "leave": { "url": "/leave/leave", "icon": <FAIcons.FaFileSignature />, "text": "Leave", "userTypes": ["sadmin", "admin"], "level": ["client"] },

    "roles": { "url": "/roles", "icon": <FAIcons.FaAward />, "text": "Roles", "userTypes": ["sadmin", "admin"], "level": ["client"] },

    "credentials": { "url": "/credentials/sms", "icon": <FAIcons.FaUsersCog />, "text": "Client Credentials", "userTypes": ["sadmin", "admin"], "level": ["client"] },
    "notification": { "url": "/notification/sms", "icon": <FAIcons.FaBell />, "text": "Notification", "userTypes": ["sadmin"], "level": ["client"] },
    "report": { "url": "/reports/attendance", "icon": <FAIcons.FaPoll />, "text": "Reports", "userTypes": ["sadmin"], "level": ["client"] }

  }

export default Menus;