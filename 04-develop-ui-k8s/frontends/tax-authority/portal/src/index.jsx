import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import TaxAdministration from './taxadministration';
import WorkandPensionsDepartment from './workandpensionsdepartment';
import HealthSecurityAgency from './healthsecurityagency';

if (process.env.REACT_APP_MODE === "TAXADMINISTRATION") {
    ReactDOM.render(<TaxAdministration />, document.getElementById('root'));
}
else if (process.env.REACT_APP_MODE === "WORKANDPENSIONSDEPARTMENT") {
    ReactDOM.render(<WorkandPensionsDepartment />, document.getElementById('root'));
}
else if (process.env.REACT_APP_MODE === "HEALTHSECURITYAGENCY") {
    ReactDOM.render(<HealthSecurityAgency />, document.getElementById('root'));
}
else {
    ReactDOM.render("None", document.getElementById('root'));
}



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();