import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import MainMenu from './component/navigation/MainMenu';
import Person from './component/person/Person';
import PersonDetails from './component/person/PersonDetails';
import Home from './component/home/Home';
import Logo from './theme/healthsecurityagency/logo.png'
import './theme/healthsecurityagency/style.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/md-light-indigo/theme.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';

class HealthSecurityAgency extends Component {
    constructor(props) {
        super(props);
        this.items = [
            {key: 1, label: 'Home', icon: 'pi pi-fw pi-home', url: "/"},
            {key: 2, label: 'Person', icon: 'pi pi-fw pi-user', command: (event) => { window.location.href = "/persons"; }},
            {key: 3, label: 'Health Benefits', icon: 'pi pi-briefcase', command: (event) => { window.location.href = "/health-benefits"; }},
            {key: 4, label: 'Cash Benefits', icon: 'pi pi-fw pi-ticket', command: (event) => { window.location.href = "/cash-benefits"; }},
        ];
    }

    componentDidMount() {
        document.title = "Health Security Agency";
    }

    render() {
        return (
            <BrowserRouter>
                <div className="healthsecurityagency max-height">
                    <div className="tesla-bar tesla-bar-top">
                        <div className="tesla-width-limiter">
                            <img className="tesla-menu-icon" src={Logo}></img>
                        </div>
                    </div>
                    <MainMenu items={this.items}></MainMenu>
                    <div className="tesla-wrapper tesla-width-limiter">
                        <Route path="/" exact component={Home}></Route>
                        <Route path="/persons" exact component={Person}></Route>
                        <Route path="/persons/detail/:id" exact component={PersonDetails}></Route>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

export default HealthSecurityAgency;