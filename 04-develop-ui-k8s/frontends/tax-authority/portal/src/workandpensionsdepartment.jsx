import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import MainMenu from './component/navigation/MainMenu';
import ContractDetails from './component/contract/ContractDetails';
import Person from './component/person/Person';
import PersonDetails from './component/person/PersonDetails';
import Grant from './component/grant/Grant';
import GrantDetails from './component/grant/GrantDetails';
import Pension from './component/pension/Pension';
import Home from './component/home/Home';
import Logo from './theme/workandpensionsdepartment/logo.png'
import './theme/workandpensionsdepartment/style.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/md-light-indigo/theme.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';

class WorkandPensionsDepartment extends Component {
    constructor(props) {
        super(props);
        this.items = [
            {label: 'Home', icon: 'pi pi-fw pi-home', url: "/"},
            {label: 'Person', icon: 'pi pi-fw pi-user', command: (event) => { window.location.href = "/persons"; }},
            {label: 'Pension', icon: 'pi pi-fw pi-ticket', command: (event) => { window.location.href = "/pensions"; }},
            {label: 'Grants', icon: 'pi pi-fw pi-money-bill', command: (event) => { window.location.href = "/grants"; }}
        ];
    }
    componentDidMount() {
        document.title = "Department for Work and Pensions";
    }
    render() {
        return (
            <BrowserRouter>
                <div className="workandpensionsdepartment max-height">
                    <div className="tesla-bar tesla-bar-top">
                        <div className="tesla-width-limiter">
                            <img className="tesla-menu-icon" src={Logo}></img>
                        </div>
                    </div>
                    <div className="workandpensionsdepartment-hr-bar"></div>
                    <MainMenu items={this.items}></MainMenu>
                    <div className="tesla-wrapper tesla-width-limiter">
                        <Route path="/" exact component={Home}></Route>
                        <Route path="/contracts/detail/:id" exact component={ContractDetails}></Route>
                        <Route path="/grants" exact component={Grant}></Route>
                        <Route path="/grants/detail/:id" exact component={GrantDetails}></Route>
                        <Route path="/grants/new" exact component={GrantDetails}></Route>
                        <Route path="/pensions" exact component={Pension}></Route>
                        <Route path="/persons" exact component={Person}></Route>
                        <Route path="/persons/detail/:id" exact component={PersonDetails}></Route>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

export default WorkandPensionsDepartment;