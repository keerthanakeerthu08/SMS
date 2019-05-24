import React, { Component, Fragment } from 'react';
import Joi from 'joi-browser';
import { Form } from 'informed';
import _ from 'lodash';
import { Breadcrumb, BreadcrumbItem, Container, Row, Col, } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import Static from 'services/static';
import CourseList from './list';
import Header from 'components/common/header';
import SideNav from 'components/common/sideNav';
import Loading from 'components/common/loading';
import { CustomSelect, } from 'components/common/forms';
import { getselectData } from 'services/userService';
import { getCourseAttendees } from 'services/courseAttendeesService';
import { rightsData } from 'services/rolesService';
var classNames = require('classnames');

export default class CourseRoot extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            data: {

            },
            parentData: [],
            prefixUrl: "",
            isPageLoading: false,
            isLoading: false,
            type: '',
            client: '',
            entity: '',
            department: '',
            branch: '',
            batch: '',
            uid: '',
            clientIds: [], entityIds: [], branchIds: [],
            EventTypes: [],
            isTableLoading: true,
            modal: false,
            payloadArray: {},
            isClient: true, isEntity: true, isBranch: true, isDepartment: true, isBatch: true
        }
    }
    async componentWillMount() {
        await this.props.isPageLoadingTrue();
    }
    async componentDidMount() {
        const { session } = this.props;
        await this.rightsData(session);
        this.selectoptGet(`clients`, "clientIds");
        await this.feildCheck();
        await this.props.isPageLoadingFalse();
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

    schema = {
        client: Joi.string().required().label('Client'),
        entity: Joi.string().required().label('Entity'),
        branch: Joi.string().required().label('Branch'),
        department: Joi.string().required().label('Department'),
        batch: Joi.string().required().label('Batch'),
    };

    rightsData = async (session) => {

        let res = await rightsData("course", session);
        let excludeModules = [];
        await _.map(_.keys(res), async v => {
            await _.map(_.keys(res[v]), k => {
                if (res[v][k]["value"])
                    return excludeModules.push(v.toLowerCase())
            })
        })
        await this.setState({ excludeModules, rightsData: res || {} });

    }

    feildCheck = async () => {
        let { session: { data: sessionData } } = this.props;
        const { data } = this.state
        const { userType, userLevel, client, entity, branch, department, batch, code, branchId, departmentId, batchId, uid, studentId } = sessionData;
        data.userLevel = userLevel;
        data['uid'] = uid;
        data['studentId'] = studentId;
        data['userType'] = userType;
        data['userLevel'] = userLevel;
        data.userType = userType;
        if (userType === 'parent')
            data.uid = studentId;
        if (userType === 'student')
            data.uid = uid;

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
                await this.onSubmit();
                break;
        }
    }

    setFormApi = (formApi) => {
        this.formApi = formApi;
    }

    handleChange = async ({ currentTarget: Input }) => {

        let formaData = this.formApi.getState().values;
        await this.setState({ data: formaData })

        const { name, value } = Input;
        const { data } = this.state;
        data[name] = value;
        await this.setState({
            [name]: value,

        })
        await this.clientDatas(name);
    }

    clientDatas = async (name) => {
        const { data } = this.state;
        switch (name) {
            case "client":
                this.selectoptGet(`namelist?client=${data.client}&type=client`, "entityIds")
                await this.setState({ entity: "", branch: "", department: "", batch: "", branchIds: [], departmentIds: [], batchIds: [], })
                break;
            case "entity":
                this.selectoptGet(`namelist?client=${data.client}&type=entity&entity=${data.entity}`, "branchIds")
                await this.setState({ branch: "", department: "", batch: "", departmentIds: [], batchIds: [], })
                break;
            case "branch":
                this.selectoptGet(`namelist?client=${data.client}&type=branch&entity=${data.entity}&branch=${data.branch}`, "departmentIds")
                await this.setState({ department: "", batch: "", batchIds: [], })
                break;
            case "department":
                this.selectoptGet(`namelist?client=${data.client}&type=department&entity=${data.entity}&branch=${data.branch}&department=${data.department}`, "batchIds")
                await this.setState({ batch: "", })
                break;
            default:
                break;
        }
    }


    onSubmit = async () => {
        this.tableHide();
        let response, params = '';
        const { data: { client, entity, branch, department, batch, uid, userType } } = this.state
        params = `client=${client}&entity=${entity}&branch=${branch}&department=${department}`

        if (batch && (userType !== 'student' || userType !== 'parent'))
            params = `client=${client}&entity=${entity}&branch=${branch}&department=${department}&batch=${batch}`

        if (userType === 'student' || userType === 'parent')
            params = `client=${client}&entity=${entity}&branch=${branch}&department=${department}&batch=${batch}&uid=${uid}`;
        response = await getCourseAttendees(params)
        if (response.data.statusCode === 1) {
            let data = response.data.data
            await this.setState({
                tableData: data,
                isTableLoading: false
            })
        } else {
            let data = [];
            await this.setState({
                tableData: data,
                isTableLoading: false
            })
            this.renderAttendeesForm(data)
        }
    }


    renderAttendeesForm(data) {//Pass the datas to the CourseList
        const { prefixUrl, rightsData, data: { userType } } = this.state;
        return <CourseList
            data={data}
            prefixUrl={prefixUrl}
            props={this.props}
            rightsData={rightsData}
            refreshTable={this.onSubmit}
            userType={userType}
        />
    }
    tableHide() {
        this.setState({
            isTableLoading: true
        })
    }


    addcourseNavigation() { // navidate to Add Attendees Page        
        return <NavLink className="btn btn-primary btn-sm btn-right" to={`/course/externalcourse/add`}>+ Add External Course</NavLink>
    }

    render() {

        const { isPageLoading, isLoading, tableData, clientIds, entityIds, branchIds, departmentIds, batchIds, rightsData, excludeModules,
            isClient, isEntity, isBranch, isDepartment, isBatch, isTableLoading } = this.state;
        let { keys: formTypeKeys, order: formTypeOrder } = Static.courseFormTypes();
        const { session } = this.props;
        let _form = "externalcourse";
        formTypeOrder = _.filter(formTypeOrder, v => _.includes(excludeModules, v))
        return (
            <Fragment >
                {session &&
                    <div className="row no-gutters bg-white page-user">
                        <Header props={this.props} />
                        <div className="col-3 col-md-2">
                            <SideNav props={this.props} />
                        </div>

                        <div className="col-9 col-md-10 p-3 content">
                            {isPageLoading && <Loading />}
                            {!isPageLoading && !isLoading &&
                                <Fragment>
                                    <Breadcrumb>
                                        <BreadcrumbItem ><NavLink to="/dashboard">Dashboard</NavLink>  </BreadcrumbItem>
                                        <BreadcrumbItem active> External Course</BreadcrumbItem>
                                    </Breadcrumb>
                                    <Container fluid>
                                        <div className="mb-4 subnav-div">
                                            {formTypeOrder.map((courseform) =>
                                                <NavLink key={courseform} to={{ pathname: `/course/${courseform}-list`, query: this.props.location.query }} className={classNames('subnav')} activeClassName="subnav-active" exact={true} >{formTypeKeys[courseform]['label']}</NavLink>
                                            )
                                            }
                                        </div>
                                        <div className="d-md-flex align-items-md-center justify-content-md-between main">
                                            <h5 className="pg-title">External Course</h5>
                                            <div style={{ textAlign: "right" }}>
                                                {rightsData && rightsData[_form] && rightsData[_form].create.value &&
                                                    this.addcourseNavigation()
                                                }

                                            </div>
                                        </div>

                                        <Form getApi={this.setFormApi} onSubmit={this.onSubmit} >
                                            {({ formApi, formState }) => (
                                                <div>
                                                    {isBatch && <section>
                                                        <Row>
                                                            {isClient && <Col sm={6} md={3}>
                                                                <CustomSelect field="client" label="Client*" name="client" getOptionValue={option => option.code} getOptionLabel={option => option.name} validateOnBlur validate={e => this.validateProperty('client', e)} onChange={this.handleChange} options={clientIds} />
                                                            </Col>
                                                            }
                                                            {isEntity &&
                                                                <Col sm={6} md={3}>
                                                                    <CustomSelect field="entity" label="Entity*" name="entity" getOptionValue={option => option.code} getOptionLabel={option => option.name} validateOnBlur validate={e => this.validateProperty('entity', e)} onChange={this.handleChange} options={entityIds} />
                                                                </Col>
                                                            }
                                                            {isBranch &&
                                                                <Col sm={6} md={3}>
                                                                    <CustomSelect field="branch" label="Branch*" name="branch" getOptionValue={option => option.code} getOptionLabel={option => option.name} validateOnBlur validate={e => this.validateProperty('branch', e)} onChange={this.handleChange} options={branchIds} />
                                                                </Col>
                                                            }
                                                            {isDepartment &&
                                                                <Col sm={6} md={3}>
                                                                    <CustomSelect field="department" label="Department*" name="department" getOptionValue={option => option.code} getOptionLabel={option => option.name} validateOnBlur validate={e => this.validateProperty('department', e)} onChange={this.handleChange} options={departmentIds} />
                                                                </Col>
                                                            }
                                                            {isBatch &&
                                                                <Col sm={6} md={3}>
                                                                    <CustomSelect field="batch" label="Batch" name="batch" getOptionValue={option => option.code} getOptionLabel={option => option.name} onChange={this.handleChange} options={batchIds} />
                                                                </Col>
                                                            }

                                                        </Row>

                                                        <div className="text-right">
                                                            {/* <button type="button" className="btn btn-primary btn-sm mr-auto" onClick={() => props.history.goBack()}>Cancel</button> */}
                                                            <button type="submit" className="btn btn-primary btn-sm">Submit</button>
                                                        </div>
                                                    </section>
                                                    }
                                                </div>
                                            )}
                                        </Form>

                                        {!isTableLoading && rightsData &&
                                            this.renderAttendeesForm(tableData)
                                        }
                                    </Container>
                                </Fragment>
                            }
                        </div>
                    </div>
                }
            </Fragment >
        );
    }
}
