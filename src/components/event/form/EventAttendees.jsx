import React, { Component, Fragment } from 'react';
import { Form } from 'informed';
import Joi from 'joi-browser';
import { Container, Row, Col, Modal, ModalBody, ModalHeader } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import { Input, CustomSelect, TestAutoSuggest } from 'components/common/forms';
import { getselectData, getStudentAutoSuggest } from 'services/userService';
import { addEvent, updateEvent } from 'services/eventService';
import ToastService from 'services/toastService';
import XLSX from 'xlsx';
import XlsExport from 'xlsexport';
import _ from 'lodash';

const columns = [
  { text: "Student ID", sort: true, hidden: false, dataField: "code", style: { width: '50px' } },
  { text: "Name", sort: true, dataField: "name", hidden: false, style: { width: '50px' } },
  { dataField: 'fees', text: 'Fees', editable: true, style: { width: '80px' } }
];

export default class EventAttendeesForm extends Component {

  state = {
    data: {
      client: "", entity: "", branch: "", department: '', batch: '',
      studentName: ""
    },
    modal: false,
    showfulllist: false,
    isTableLoading: true,
    showstudentList: false,
    clientIds: [], entityIds: [], branchIds: [], departmentIds: [], batchIds: [],
    EventTypes: [],
    Students: [],
    isEditForm: false,
    isClient: true, isEntity: true, isBranch: true, isDepartment: true, isBatch: true
  }

  async componentDidMount() {
    const { data } = this.state
    this.selectoptGet(`clients`, "clientIds")
    await this.feildCheck()
    this.formApi.setValues(data);
    const { actiontype } = this.props
    if (actiontype === "edit") {
      this.setState({ isEditForm: true });
      const { location: { state } } = this.props.props;
      if (state !== undefined)
        return this.formStateCheck(state.eventdata);
    }
  }

  feildCheck = async () => {
    let { session: { data: sessionData } } = this.props.props;
    const { data } = this.state
    const { userType, userLevel, client, entity, branch, department, batch, code, branchId, departmentId, batchId } = sessionData;
    let switchType = '';
    if (userType === 'staff')
      switchType = userLevel;
    else
      switchType = userType;
    switch (switchType) {
      case 'sadmin':
        break;
      case 'client':
        data['client'] = client;
        await this.setState({ data, isClient: false })
        await this.clientDatas('client');
        await this.formApi.setValues(data);
        break;
      case 'entity':
      case 'branch':
        data['client'] = userType === "client" ? code : client;
        data['entity'] = userType === "entity" ? code : entity;
        data['branch'] = branch || branchId;
        await this.setState({ data, isClient: false, isEntity: false, isBranch: false })
        await this.clientDatas('client');
        await this.clientDatas('entity');
        await this.clientDatas('branch');
        await this.formApi.setValues(data);
        break;
      case 'department':
        data['client'] = userType === "client" ? code : client;
        data['entity'] = userType === "entity" ? code : entity;
        data['branch'] = branch || branchId;
        data['department'] = department || departmentId;
        await this.setState({ data, isClient: false, isEntity: false, isBranch: false, isDepartment: false })
        await this.clientDatas('client');
        await this.clientDatas('entity');
        await this.clientDatas('branch');
        await this.clientDatas('department');
        await this.formApi.setValues(data);
        break;
      default:
        data['client'] = userType === "client" ? code : client;
        data['entity'] = userType === "entity" ? code : entity;
        data['branch'] = branch || branchId;
        data['department'] = department || departmentId;
        data['batch'] = batch || batchId;
        await this.setState({ data, isClient: false, isEntity: false, isBranch: false, isDepartment: false, isBatch: false });
        await this.setState({ data, isClient: false, isEntity: false, isBranch: false, isDepartment: false })
        await this.clientDatas('department');
        await this.clientDatas('batch');
        await this.formApi.setValues(data);
        break;
    }
  }

  formStateCheck = async (data) => {
    data.department = data.departmentId
    data.batch = data.batchId
    data.eventname = data.event
    await this.setState({ data, department: data.departmentId, batch: data.batchId, studentName: data.studentName, studentUid: data.uid, });
    try {
      await this.clientDatas('client');
      await this.clientDatas('entity');
      await this.clientDatas('branch');
      await this.clientDatas('department');
      await this.clientDatas('batch');
      await this.formApi.setValues(data);
    } catch (err) {
      this.handleError(err);
    }
  }

  async selectoptGet(url, type) {
    const data = await getselectData(url)
    if (data.data.statusCode === 1) {
      const Datas = data.data.data
      this.setState({ [type]: Datas });
    }
  }

  schema = { //Validate all the Feilds present in this Modules
    client: Joi.string().required().label('Client'),
    entity: Joi.string().required().label('Entity'),
    branch: Joi.string().required().label('Branch'),
    department: Joi.string().required().label('Department'),
    batch: Joi.string().required().label('Batch'),
    eventname: Joi.string().required().label('Event Name'),
    fee: Joi.number().required().label('Fees'),
    studentName: Joi.string().required().label('Student Name'),
  }

  validateProperty = (name, value) => {
    const schema = Joi.reach(Joi.object(this.schema), name)
    const { error } = Joi.validate(value, schema);
    return error ? error.details[0].message : null;
  };

  handleChange = async ({ currentTarget: Input }) => {
    const { name, value } = Input;
    const { data } = this.state;
    data[name] = value;
    this.setState({
      [name]: value
    }, () => {
    })
    await this.clientDatas(name);
  }

  bulkModalToggle() {
    this.setState({
      modal: !this.state.modal,
      modalsize: "lg"
    });
  }

  downloaddata = async () => {
    const { studentList } = this.state
    let dataarr = []
    if (studentList && studentList.length > 0) {

      for (let item of studentList) {
        let obj = {
          "StudentID": item.code, "StudentName": item.name, "Fees": ""
        }
        dataarr.push(obj)
      }
      var xls = new XlsExport(dataarr)
      xls.exportToXLS('Event Attendees.xls')
    }
  }

  clientDatas = async (name) => { // Get the Client,Entity,Branch,Department,Batch,EventName Lists
    const { data } = this.state;
    switch (name) {
      case "client":
        this.selectoptGet(`namelist?client=${data.client}&type=client`, "entityIds")
        await this.setState({ entity: "", branch: "", department: "", batch: "", branchIds: [], departmentIds: [], batchIds: [] })
        break;
      case "entity":
        this.selectoptGet(`namelist?client=${data.client}&type=entity&entity=${data.entity}`, "branchIds")
        await this.setState({ branch: "", department: "", batch: "", departmentIds: [], batchIds: [] })
        break;
      case "branch":
        this.selectoptGet(`namelist?client=${data.client}&type=branch&entity=${data.entity}&branch=${data.branch}`, "departmentIds")
        await this.setState({ department: "", batch: "", batchIds: [] })
        break;
      case "department":
        this.selectoptGet(`namelist?client=${data.client}&type=department&entity=${data.entity}&branch=${data.branch}&department=${data.department}`, "batchIds")
        await this.setState({ batch: "" })
        this.getStudentList()
        break;
      case "batch":
        this.selectoptGet(`scheduleTypeId?client=${data.client}&type=event&entity=${data.entity}&branch=${data.branch}`, "EventTypes")
        await this.setState({})
        break;
      case "eventname":
        await this.setState({ showstudentList: true })
        break;
      default:
        break;
    }
  }

  getStudentList = async () => {
    var studentList = []
    const { data: { client, branch, entity } } = this.state
    let params = `client=${client}&entity=${entity}&branch=${branch}&type=student`
    const res = await getStudentAutoSuggest(params);
    if (res.data.statusCode === 1) {
      var test = res.data.data
      for (var i = 0; i < test.length; i++) {
        studentList.push({ "name": test[i].name, "code": test[i].uid })
      }
      await this.setState({ studentList, isTableLoading: false })
    }
    if (res.data.statusCode !== 1) return ToastService.Toast(res.data.message, 'default');
  }

  autoSujestValue = (id, name) => {
    this.setState({
      studentUid: id,
      studentName: name
    })
  }

  setFormApi = (formApi) => {
    this.formApi = formApi
  }

  resetForm = () => {
    this.formApi.reset()
    let path = `/event/addAttendees` //Redirect the page after updated the datas
    this.props.props.history.push({
      pathname: path,
    })
  }

  onSubmit = async () => { //Store Datas to the APIs
    this.getStudentList()
  }

  showStudentTable = async () => {
    await this.setState({ showfulllist: true })
  }

  onSubmit = async () => { //Store Datas to the APIs
    let response;
    const { actiontype } = this.props
    const data = this.formApi.getState().values;
    const { studentName, studentUid } = this.state
    let addParams = `client=${data.client}&entity=${data.entity}&branch=${data.branch}`
    let updateParams = addParams + `&departmentId=${data.departmentId}&batchId=${data.batchId}&student=${data.student}`
    let addEvents = {
      "departmentId": data.department, "event": data.eventname,
      "student": studentUid, "batchId": data.batch,
      "fee": data.fee, "studentName": studentName
    }
    let updateEventData = { "event": data.eventname }
    if (actiontype === 'add')
      response = await addEvent(addParams, addEvents)
    else if (actiontype === 'edit') {
      response = await updateEvent(updateParams, updateEventData)
    }
    if (response.data.statusCode !== 1) return ToastService.Toast(response.data.message, 'default'); // Check Datas
    if (response.data.statusCode === 1) {
      await ToastService.Toast(response.data.message, 'default');
      this.resetForm();
    }
  }

  readFile = async (e) => {
    e.persist();
    this.setState({ payloadArray: [], payloadData: [], studentstaffHeaders: '' })
    if (e.target.files[0].size <= 2000000) {
      const rABS = true;
      const files = e.target.files;
      const f = files[0];
      const reader = new FileReader();
      reader.onload = async (e) => {
        var data = e.target.result;
        if (!rABS) data = new Uint8Array(data);
        const wb = XLSX.read(data, { type: rABS ? 'binary' : 'array', cellDates: true })
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        this.setState({
          studentstaffHeaders: data[0]
        })
        const datas = XLSX.utils.sheet_to_json(ws, { range: 1, header: this.state.studentstaffHeaders });
        await this.setState({ ws: datas, file: f });
      };
      if (rABS) reader.readAsBinaryString(f); else reader.readAsArrayBuffer(f);
    } else {
      alert("File size can not exceed 2 MB");
    }
  }

  saveDetails(e) {
    if (this.state.ws) {
      if (this.state.ws.length === 0) return ToastService.Toast("You are uploading the empty file!", 'default');
      this.payloadData(this.state.ws);
    } else {
      return ToastService.Toast("Upload the  file!", 'default');
    }
  }

  async payloadData(data) {
    this.setState({ payloadArray: [], userdataArray: [] })
    const { branch, client, entity, eventname, department, batch } = this.state
    let addParams = `client=${client}&entity=${entity}&branch=${branch}`;
    data = _.filter(data, d => d.Fees !== undefined);
    await _.map(data).forEach(async (item) => {
      const { StudentName, StudentID, Fees, } = item;
      let eventBulkdata = {
        "departmentId": department, "event": eventname,
        "student": StudentID, "batchId": batch,
        "fee": Fees, "studentName": StudentName
      }
      await addEvent(addParams, eventBulkdata);
      await this.setState({ modal: false });

    });
    await ToastService.Toast("Uploaded Successfully!!!", 'default');
    await this.props.props.history.goBack();
  }

  render() {
    const { actiontype, props } = this.props
    const { clientIds, entityIds, branchIds, departmentIds, batchIds, studentList,
      isClient, isEntity, isBranch, isDepartment, isBatch, showstudentList, showfulllist
    } = this.state

    return (
      <Fragment>
        <Form getApi={this.setFormApi} onSubmit={this.onSubmit} >
          {({ formApi, formState }) => (
            <div>
              {isDepartment &&
                <section>
                  <Row>
                    {isClient &&
                      <Col sm={12} md={3}>
                        <CustomSelect field="client" label="Client*" name="client" getOptionValue={option => option.code} getOptionLabel={option => option.name} options={clientIds}
                          validateOnBlur validate={e => this.validateProperty('client', e)} onChange={this.handleChange} />
                      </Col>}
                    {isEntity &&
                      <Col sm={12} md={3}>
                        <CustomSelect field="entity" label="Entity*" name="entity" getOptionValue={option => option.code} getOptionLabel={option => option.name} validateOnBlur validate={e => this.validateProperty('entity', e)} options={entityIds}
                          onChange={this.handleChange} />
                      </Col>}
                    {isBranch &&
                      <Col sm={12} md={3}>
                        <CustomSelect field="branch" label="Branch*" name="branch" getOptionValue={option => option.code} getOptionLabel={option => option.name} validateOnBlur validate={e => this.validateProperty('branch', e)} options={branchIds}
                          onChange={this.handleChange} />
                      </Col>}
                    {isDepartment &&
                      <Col sm={12} md={3}>
                        <CustomSelect field="department" label="Department*" name="department" getOptionValue={option => option.code}
                          getOptionLabel={option => option.name} validateOnBlur validate={e => this.validateProperty('department', e)} options={departmentIds}
                          onChange={this.handleChange} />
                      </Col>
                    }
                  </Row>
                </section>
              }
              <section>
                <Row>
                  {isBatch &&
                    <Col sm={12} md={3}>
                      <CustomSelect field="batch" label="Batch*" name="batch" getOptionValue={option => option.code}
                        getOptionLabel={option => option.name} options={batchIds} validateOnBlur validate={e => this.validateProperty('batch', e)}
                        onChange={this.handleChange} />
                    </Col>}
                  <Col sm={12} md={3}>
                    <CustomSelect field="eventname" label="Event Name*" name="eventname" getOptionValue={option => option.title} getOptionLabel={option => option.title} options={this.state.EventTypes} validateOnBlur validate={e => this.validateProperty('eventname', e)} onChange={this.handleChange}
                    />
                  </Col>
                  <Col sm={12} md={3}>
                    <Input
                      field="fee" label="Fees*" name="fee"
                      validateOnBlur validate={e => this.validateProperty('fee', e)}
                    />
                  </Col>
                  <Col sm={12} md={3}>
                    {studentList && actiontype === 'add' &&
                      <div>
                        <label>StudentName*</label>
                        <Col sm={6} md={3}>
                          <TestAutoSuggest label="Students" name="students" field="students" data={studentList} filterOption="name" getOptionValue={(id, name) => this.autoSujestValue(id, name)} validateOnBlur validate={e => this.validateProperty('students', e)} onChange={this.handleChange} style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', paddingLeft: '-0.5rem', fontSize: '0.875rem', width: '220px', marginLeft: '-15px' }} />
                        </Col>
                      </div>
                    }
                    {studentList && actiontype === 'edit' &&
                      <div>
                        <label>StudentName*</label>
                        <Col sm={6} md={3}>
                          <TestAutoSuggest label="Students" name="students" field="students" data={studentList} filterOption="name" getOptionValue={(id, name) => this.autoSujestValue(id, name)} validateOnBlur validate={e => this.validateProperty('students', e)} onChange={this.handleChange}
                            disabled
                          />
                        </Col>
                      </div>
                    }
                  </Col>
                </Row>
                <Row>
                  <Col sm={6}></Col>
                  <Col sm={6} style={{ textAlign: "right" }}>
                    <button type="button" className="btn btn-primary btn-sm mr-auto" onClick={() => props.history.goBack()}>Cancel</button>
                    <button type="submit" className="btn btn-primary btn-sm">Submit </button>
                  </Col>
                </Row>
              </section>
              {showstudentList &&
                <Row>
                  <p>Click <span style={{ color: '#0076ffb0', cursor: "pointer" }} onClick={() => this.showStudentTable()} >here</span> for Bulk Upload</p>
                </Row>
              }
              {showfulllist &&
                <Row>
                  <Col sm={6}></Col>
                  <Col sm={6} style={{ textAlign: "right" }}>
                    <button onClick={() => this.bulkModalToggle()} className="btn btn-outline-secondary btn-sm" >  Upload</button>
                  </Col>
                </Row>
              }
            </div>
          )}
        </Form>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} size={this.state.modalsize}>
          <ModalHeader toggle={this.toggle}>Import / Export</ModalHeader>
          <ModalBody>
            <Container>
              <Form onSubmit={(e) => this.saveDetails(e)}>
                <div>
                  <section>
                    <h6>Event Attendees</h6>
                    <Row>
                      <Col sm={6} md={6} >
                        <input id="upload" ref="upload" type="file" onChange={(event) => { this.readFile(event) }} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                      </Col>
                      <Row className="justify-content-end" >
                        <button type="button" className="btn btn-warning cancel" onClick={() => this.bulkModalToggle()} style={{ marginRight: '20px' }} >Cancel</button>
                        <button type="submit" className="btn btn-primary btn-sm" onSubmit={(e) => this.saveDetails(e)} >Save</button>
                      </Row>
                    </Row>
                  </section><br />
                  <section>
                    <h6>Download Format</h6><br />
                    <Row>
                      <Col sm={6} md={6} >
                        <div >
                          {/* <a href="../../assets/xlsformats/Assignment-List.xls" download>Assignment Lists </a> */}
                          <p onClick={() => this.downloaddata()} style={{ cursor: "pointer" }}>EventAttendees Lists</p>
                        </div>
                      </Col>
                    </Row>
                  </section>
                </div>

              </Form>
            </Container>
          </ModalBody>
        </Modal>
        {showfulllist && studentList &&
          <BootstrapTable
            keyField="uid"
            data={this.state.studentList}
            columns={columns}
            bootstrap4
            classes="table table-bordered table-hover table-sm"
            wrapperClasses="table-responsive"
          />}
      </Fragment>
    )
  }
}