import Menus from 'components/common/Menus';
import _ from 'lodash';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav, Navbar, NavItem } from 'reactstrap';
import { getRoles } from 'services/rolesService';

class SideNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      RightsList: [],
    };
  }

  async componentDidMount() {
    await this.menuFormation();
  }

  menuFormation = async () => {
    const { session: { data: { userType } }, session } = this.props.props;
    let list = {}
    let RightsList = {};
    list = Menus;
    if (userType === 'client' || userType === 'entity') {
      delete list.clients
      RightsList = list
    }
    else {
      await this.Rights(session);
      const { userRights } = this.state;
      _.forEach(userRights, (r, key) => {
        RightsList[r] = list[r];
      });
    }
    if (userType === 'sadmin') {
      RightsList = list
    }
    await this.setState({ RightsList });
  }

  Rights = async (session) => {
    let rightsArr = ["clients", "setting", "user", "schedule", "roles", "timetable", "attendance", "fee", "leave", "exam", "course", "event", "report", "credentials", "notification", "grade"];
    let filterArr = ["dashboard"];
    if (session && session.data) {
      const { data: { client, entity, branch, roles } } = session
      if (client && entity && branch && roles) {
        let res = await getRoles(`client=${client}&entity=${entity}&branch=${branch}&type=${roles}`);
        if (res && res.data.statusCode === 1) {
          let rightsData = res.data.data[0];
          _.map(rightsArr, (m, key) => {
            _.map(rightsData[m], (s, key) => {
              _.map(_.keys(s), (a, key) => {
                if (s[a].value) return filterArr.push(m);
              });
            });
          });
          filterArr = await _.uniq(filterArr)
          await this.setState({
            userRights: filterArr
          })
        }
      }
    }
  }


  render() {
    const { RightsList } = this.state;
    return (
      <Navbar className="sidemenu" >
        {RightsList &&
          <Nav navbar>
            {_.map(_.keys(RightsList), (item, i) =>
              <NavItem key={i}>
                <NavLink to={RightsList[item].url} className="nav-link">{RightsList[item].icon} {RightsList[item].text}</NavLink>
              </NavItem>
            )}
          </Nav>
        }
      </Navbar>
    )
  }
}
export default SideNav;