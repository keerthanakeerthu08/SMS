import _ from 'lodash';
import React, { Component } from 'react';
import Service from 'services/service';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledButtonDropdown } from 'reactstrap';
import XlsExport from 'xlsexport';

import ToastService from 'services/toastService'
import { deleteHomeworks, deleteAssignments } from '../../services/assignmentService'
import { confirm } from 'services/confirm'

export default class AssignmentList extends Component {

    state = {
        data: []
    }

    async componentDidMount() {
        const { data, details, rightsData } = this.props;
        await this.setState({ data, details, rightsData })
        await this.tableData();
    }

    actionsFormatter = (cell, row, rowIndex, formatExtraData) => {
        const { type } = this.props
        let links = [];
        const { rightsData } = this.state;
        let _form = _.upperFirst(type);
        rightsData && rightsData[_form] && rightsData[_form].edit.value &&
            links.push(<div onClick={() => this.editFun(`/assignments/edit/${type}`, row)} className='badge badge-warning'>Edit</div>)
        rightsData && rightsData[_form] && rightsData[_form].delete.value &&
            links.push(<div onClick={() => confirm("Are you sure? You want to delete this", () => actionSetting(type, row, this.props))} className='badge badge-danger'>Delete</div>)
        return <div className="actions">{links.concat(" ")}</div>
    }

    async tableData() {
        const { userType } = this.props;
        var homeworkView = []
        const { type } = this.props
        if (type === 'homework') {
            let columns = [
                { dataField: 'topic', text: 'Topic', sort: true },
                { dataField: 'subject', text: 'Subject', sort: true },
                { dataField: 'remarks', text: 'Remarks', sort: true },
                { dataField: 'date', text: 'Submission Date', sort: true },
                { dataField: 'status', text: 'Status', filter: this.getTextFilter(), sort: true },
                { dataField: 'actions', isDummyField: true, text: "Actions", formatter: this.actionsFormatter }
            ];
            if (userType !== 'student') {
                columns.unshift({ dataField: 'studentId', text: 'Student ID', filter: this.getTextFilter(), sort: true });
                columns.unshift({ dataField: 'studentname', text: 'Student Name', filter: this.getTextFilter(), sort: true });
            }
            await this.setState({ columns })
            let data = this.state.data

            let temp = [];
            await _.map(data, v => {
                if (v.homeWorkReport !== undefined)
                    temp.push(v)
            });
            if (temp.length === 0) { await this.setState({ homeworkView: [] }) }
            for (let item of data) {
                if (item.homeWorkReport) {
                    const { status, subject, topic, remarks, date } = item.homeWorkReport[0]
                    const { studentId, name } = item
                    homeworkView.push({ "studentId": studentId, "studentname": name, "topic": topic, "subject": subject, "status": status, "remarks": remarks, date: date })
                    await this.setState({ homeworkView: homeworkView })
                }
            }
        } else if (type === 'assignment') {

            let columns = [
                { dataField: 'topic', text: 'Topic', sort: true },
                { dataField: 'subject', text: 'Subject', sort: true },
                { dataField: 'marks', text: 'Marks', sort: true },
                { dataField: 'totalMarks', text: 'Total Marks', sort: true },
                { dataField: 'remarks', text: 'Remarks', sort: true },
                { dataField: 'createdDate', text: 'Submission Date', sort: true },
                { dataField: 'actions', isDummyField: true, text: "Actions", formatter: this.actionsFormatter }
            ];

            if (userType !== 'student') {
                columns.unshift({ dataField: 'studentId', text: 'Student ID', filter: this.getTextFilter(), sort: true });
                columns.unshift({ dataField: 'studentname', text: 'Student Name', filter: this.getTextFilter(), sort: true });
            }


            await this.setState({ columns })
            let data = this.state.data

            let temp = [];
            await _.map(data, v => {
                if (v.assignmentReport !== undefined)
                    temp.push(v)
            });
            if (temp.length === 0) { await this.setState({ homeworkView: [] }) }
            for (let item of temp) {

                if (item.assignmentReport) {
                    const { topic, subject, marks, totalMarks, remarks, createdDate } = item.assignmentReport[0]
                    const { studentId, name } = item
                    homeworkView.push({ "studentId": studentId, "studentname": name, "topic": topic, "subject": subject, "marks": marks, "totalMarks": totalMarks, "createdDate": createdDate, "remarks": remarks })
                    await this.setState({ homeworkView: homeworkView })
                }
            }
        }
    }

    editFun = (url, data) => {
        let row = data
        let details = this.props.details
        this.props.props.history.push({
            pathname: url,
            state: {
                row,
                details
            }
        })
    }

    getTextFilter(type = "default") {
        return textFilter({
            placeholder: '',
            delay: 1000
        })
    }


    //   getSelectFilter(type = "default") {
    //     return selectFilter({
    //         options: selectOptions,
    //         className: 'test-classname',
    //         withoutEmptyOption: true,
    //         defaultValue: 2,
    //         style: { backgroundColor: 'pink' }
    //     })
    //   }


    async exceltable(format) {
        const { type } = this.props
        let d;
        const { homeworkView } = this.state
        if (homeworkView.length > 0) {
            d = this.downloadxls(homeworkView)
            var xls = new XlsExport(d)
            if (type === 'assignment') {
                xls.exportToXLS('AssignmentList.xls')
            } else if (type === 'homework') {
                xls.exportToXLS('HomeworkList.xls')
            }
        } else {
            ToastService.Toast('Data Not Found!!!', "default")
        }

    }

    downloadxls(data) {
        const { type } = this.props
        let dataarr = []
        if (data && data.length > 0) {
            if (type === 'assignment') {
                for (let item of data) {
                    let obj = {
                        "User ID": item.studentId, "Topic": item.topic, "Subject": item.subject, "Marks": item.marks, "Total Mark": item.totalMarks, "Remarks": item.remarks
                    }
                    dataarr.push(obj)
                }
            } else if (type === 'homework') {
                for (let item of data) {
                    let obj = {
                        "User ID": item.studentId, "Topic": item.topic, "Subject": item.subject, "Remarks": item.remarks, "Status": item.status
                    }
                    dataarr.push(obj)
                }
            }
            return dataarr
        } else {
            return dataarr
        }
    }

    render() {
        const { homeworkView, columns, rightsData } = this.state
        const { type } = this.props;
        let _form = _.upperFirst(type);
        const options = {
            paginationSize: 4,
            pageStartIndex: 1,
            sizePerPage: 100,
            alwaysShowAllBtns: true,
            hideSizePerPage: true,
            hidePageListOnlyOnePage: true,
            firstPageText: 'First',
            prePageText: 'Back',
            nextPageText: 'Next',
            lastPageText: 'Last',
            nextPageTitle: 'First page',
            prePageTitle: 'Pre page',
            firstPageTitle: 'Next page',
            lastPageTitle: 'Last page',
            showTotal: true
        };


        return (
            <React.Fragment >
                {
                    homeworkView &&
                    <div className="d-md-flex align-items-md-center justify-content-md-between">

                        <div>
                            {
                                rightsData && rightsData[_form] && rightsData[_form].export.value &&
                                <UncontrolledButtonDropdown >
                                    <DropdownToggle caret className="btn btn-outline-secondary btn-sm" style={{ color: "#fff" }}>Download</DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem onClick={() => { this.exceltable('alluserxls') }}> Excel Format</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledButtonDropdown>
                            }
                            &nbsp;
                    </div>
                    </div>

                }

                {
                    homeworkView &&
                    <BootstrapTable
                        keyField="studentId"
                        data={homeworkView}
                        columns={columns}
                        bootstrap4
                        pagination={paginationFactory(options)}
                        classes="table table-bordered table-hover table-sm"
                        wrapperClasses="table-responsive"
                        filter={filterFactory()}
                        noDataIndication={'No data to display here'}

                    />
                }
            </React.Fragment>)
    }
}

async function actionSetting(type, row, data) {
    const { studentId } = row
    const { client, entity, department, branch, batch, ID } = data.details
    if (type === 'assignment') {
        let params = `uid=${studentId}&batch=${batch}&department=${department}&assignmentId=${ID}&client=${client}&entity=${entity}&branch=${branch}`
        const deleteAss = await deleteAssignments(params)
        if (deleteAss.data.statusCode === 1) {
            return Service.showAlert(deleteAss.data.Message, '', 'Success')
        }
    } else if (type === 'homework') {
        let params = `uid=${studentId}&batch=${batch}&department=${department}&homeworkId=${ID}&client=${client}&entity=${entity}&branch=${branch}`
        const deletehw = await deleteHomeworks(params)
        if (deletehw.data.statusCode === 1) {
            return Service.showAlert(deletehw.data.Message, '', 'Success')
        }
    }
}