import 'styles/App.scss';

import { CustomSelect, Textarea } from 'components/common/forms';
import DRP1 from 'components/common/forms/date-range-picker';
import { Form } from 'informed';
import Joi from 'joi-browser';
import moment from 'moment';
import React, { Component, Fragment } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { leaveInsert } from 'services/leaveService';
import ToastService from 'services/toastService';
import { getselectData } from 'services/userService';

export default class LeaveForm extends Component {
  state = {
    data: {
      client: "", entity: "", branch: "", department: "", batch: "",
    },
    clientIds: [], entityIds: [], branchIds: [], departmentIds: [], batchIds: [], examIds: [], subjects: [],
    isEditForm: false,
    parentData: [],
    prefixUrl: "",
    type: '',
    isClient: true, isEntity: true, isBranch: true, isDepartment: true, isBatch: true
  }

  async componentDidMount() {
    let uid = this.props.props.session.uid
    let name = this.props.props.session.data.name
    await this.setState({
      uid, name
    })
    const { actiontype } = this.props
    await this.selectoptGet(`clients`, "clientIds");
    await this.feildCheck();
    if (actiontype === "edit" || actiontype === "view") {
      const { location: { state } } = this.props.props
      this.setState({ isEditForm: true, date: moment(state.date) })
      if (state !== undefined)
        return this.formStateCheck(state);
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
        await this.setState({ data, isClient: false, isEntity: false, isBranch: false, isDepartment: false, isBatch: false })
        await this.formApi.setValues(data);
        break;
    }
  }

  formStateCheck = async (data) => {
    data.department = data.departmentId
    data.batch = data.batchId
    data.eventname = data.event
    data.studentName = data.student
    data.examid = data.examId
    data.subject = data.subjectId
    data.starttime = data.time.from
    data.endtime = data.time.to
    data.examname = data.examName
    await this.setState({ data, department: data.departmentId, batch: data.batchId });
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

  handleError(...err) {
    return ToastService.Toast("Something went wrong.Please try again later", 'default');
  }

  schema = {
    client: Joi.string().required().label("Client"),
    entity: Joi.string().required().label("Entity"),
    branch: Joi.string().required().label("Branch"),
    department: Joi.string().required().label("Department"),
    batch: Joi.any().optional().label("Batch"),
    date: Joi.string().required().label("Date"),
    reason: Joi.string().required().label("Reason"),
  }
  getSampleData = async () => {

  }

  handleChange = async ({ currentTarget: Input }) => {
    const { name, value } = Input;
    const { data } = this.state;
    data[name] = value;

    this.setState({
      [name]: value
    }, () => {

    })
    await this.clientDatas(name, Input);


  }


  clientDatas = async (name, Input) => {
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
        break;
      case "batch":
        break;
      default:
        break;


    }
  }


  async selectoptGet(url, type) {
    const data = await getselectData(url)
    if (data.data.statusCode === 1) {
      const Datas = data.data.data
      this.setState({ [type]: Datas });
    }
  }


  validateProperty = (name, value) => {
    const schema = Joi.reach(Joi.object(this.schema), name)
    const { error } = Joi.validate(value, schema);
    return error ? error.details[0].message : null;
  };

  
  dateValue = async (date, field) => { // Get dates from the data range picker
    const data = this.formApi.getState().values;
    let { from, to } = date;
    if (!moment(to).isValid()) to = from;
    data[field] = { from: moment(from).format("YYYY-MM-DD"), to: moment(to).format("YYYY-MM-DD") };
    data.startDate = data.date.from;
    data.endDate = data.date.to; 
    await this.formApi.setValues(data);
    await this.setState({ data });
  }
  setFormApi = (formApi) => {
    this.formApi = formApi;
  }

  onSubmit = async () => {

    const data = this.formApi.getState().values
    const { client, entity, branch, department, batch, reason } = data

    let params = `client=${client}&entity=${entity}&branch=${branch}&department=${department}&batch=${batch}&uid=${this.state.uid}&name=${this.state.name}&status=request&reason=${reason}&fromDate=${data.date.from}&endDate=${data.date.to}`

    let res = await leaveInsert(params)
    if (res.data.statusCode === 1) {

      this.props.props.history.push({
        pathname: "/leave/leave",

      })
      ToastService.Toast(`Leave Request Sent Successfully!!!`, "default")

    } else {
      ToastService.Toast(`Leave Request Failed!!!`, "default")
    }

  }

  render() {
    const { clientIds, entityIds, branchIds, departmentIds, batchIds, isClient, isEntity, isBranch, isDepartment, isBatch } = this.state;
    const { props } = this.props;

    return (
      <React.Fragment >
        <Fragment>
          <h6>Add Leave</h6>
          <Container fluid>
            <Form getApi={this.setFormApi} onSubmit={this.onSubmit}>
              {({ formApi, formState }) => (
                <div className="page-user">
                  {isBatch &&
                    <section>
                      <h6>Client Details</h6>
                      <Row>
                        {isClient &&
                          <Col sm={12} md={3}>
                            <CustomSelect field="client" label="Client*" name="client" getOptionValue={option => option.code}
                              getOptionLabel={option => option.name} options={clientIds}
                              validateOnBlur validate={e => this.validateProperty('client', e)} onChange={this.handleChange} />
                          </Col>
                        }
                        {isEntity &&
                          <Col sm={12} md={3}>
                            <CustomSelect field="entity" label="Entity*" name="entity" getOptionValue={option => option.code}
                              getOptionLabel={option => option.name} options={entityIds}
                              validateOnBlur validate={e => this.validateProperty('entity', e)} onChange={this.handleChange} />
                          </Col>
                        }
                        {isBranch &&
                          <Col sm={12} md={3}>
                            <CustomSelect field="branch" label="Branch*" name="branch" getOptionValue={option => option.code}
                              getOptionLabel={option => option.name} options={branchIds}
                              validateOnBlur validate={e => this.validateProperty('branch', e)} onChange={this.handleChange} />
                          </Col>
                        }
                        {isDepartment &&
                          <Col sm={12} md={3}>
                            <CustomSelect field="department" label="Department*" name="department" getOptionValue={option => option.code}
                              getOptionLabel={option => option.name} options={departmentIds}
                              validateOnBlur validate={e => this.validateProperty('department', e)} onChange={this.handleChange} />
                          </Col>
                        }
                        {isBatch &&
                          <Col sm={12} md={3}>
                            <CustomSelect field="batch" label="Batch" name="batch" getOptionValue={option => option.code}
                              getOptionLabel={option => option.name} options={batchIds}
                              validateOnBlur validate={e => this.validateProperty('batch', e)} onChange={this.handleChange} />
                          </Col>
                        }
                      </Row>
                    </section>
                  }
                  <section>
                    <h6>Leave Details</h6>
                    <Row>
                      <Col sm={12} md={5}>
                        <label>Date*</label>
                        <DRP1 field="date" label="Date*" id="date" startDate={moment(formState.values.startDate)} endDate={moment(formState.values.endDate)} onChange={(data) => this.dateValue(data, "date")} validate={e => this.validateProperty('date', e)} />
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="12" md="12">
                        <Textarea
                          field="reason" label="Reason*" name="reason"
                          validateOnBlur validate={e => this.validateProperty('reason', e)}
                        />
                      </Col>
                    </Row>

                  </section>
                  <div className="text-right">
                    <button type="button" className="btn btn-primary btn-sm mr-auto" onClick={() => props.history.goBack()}>Cancel</button>
                    <button type="submit" className="btn btn-primary btn-sm">Submit</button>
                  </div>
                </div>
              )}

            </Form>
          </Container>
        </Fragment>

      </React.Fragment >
    );
  }
}

