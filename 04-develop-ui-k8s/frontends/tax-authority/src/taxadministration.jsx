import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import MainMenu from './component/navigation/MainMenu';
import Contract from './component/contract/Contract';
import ContractDetails from './component/contract/ContractDetails';
import Person from './component/person/Person';
import PersonDetails from './component/person/PersonDetails';
import Employers from './component/employer/Employers';
import EmployerDetails from './component/employer/EmployerDetails';
import Home from './component/home/Home';
import Logo from './theme/taxadministration/logo.png'
import './theme/taxadministration/style.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/md-light-indigo/theme.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';

class TaxAdministration extends Component {
    constructor(props) {
        super(props);
        this.items = [
            {key: 1, label: 'Home', icon: 'pi pi-fw pi-home', url: "/"},
            {key: 2, label: 'Person', icon: 'pi pi-fw pi-user', command: (event) => { window.location.href = "/persons"; }},
            {key: 3, label: 'Employer', icon: 'pi pi-briefcase', command: (event) => { window.location.href = "/employers"; }},
            {key: 4, label: 'Contract', icon: 'pi pi-fw pi-ticket', command: (event) => { window.location.href = "/contracts"; }},
        ];
    }

    componentDidMount() {
        document.title = "Tax Administration";
    }

    render() {
        return (
            <BrowserRouter>
                <div className="taxadministration max-height">
                    <div className="tesla-bar tesla-bar-top">
                        <div className="tesla-width-limiter">
                            <img className="tesla-menu-icon" src={Logo}></img>
                        </div>
                    </div>
                    <MainMenu items={this.items}></MainMenu>
                    <div className="tesla-wrapper tesla-width-limiter">
                        <Route path="/" exact component={Home}></Route>
                        <Route path="/contracts" exact component={Contract}></Route>
                        <Route path="/contracts/detail/:id" exact component={ContractDetails}></Route>
                        <Route path="/contracts/new" exact component={ContractDetails}></Route>
                        <Route path="/contracts/new/predefined" exact component={ContractDetails}></Route>
                        <Route path="/persons" exact component={Person}></Route>
                        <Route path="/persons/detail/:id" exact component={PersonDetails}></Route>
                        <Route path="/persons/new" exact component={PersonDetails}></Route>
                        <Route path="/employers" exact component={Employers}></Route>
                        <Route path="/employers/detail/:id" exact component={EmployerDetails}></Route>
                        <Route path="/employers/new" exact component={EmployerDetails}></Route>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

export default TaxAdministration;