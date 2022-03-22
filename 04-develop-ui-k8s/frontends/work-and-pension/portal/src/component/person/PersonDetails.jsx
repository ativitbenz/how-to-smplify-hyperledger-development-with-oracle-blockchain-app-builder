import React, { Component, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Divider } from 'primereact/divider';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { Tag } from 'primereact/tag';
import { Timeline } from 'primereact/timeline';
import { BlockchainService } from '../../service/BlockchainService'
import { Binding, Form, DateUtil } from '../../utils/Util'

class PersonDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            person: {
                taxIdentificationNumber: "",
                tajNumber: "",
                firstName: "",
                lastName: "",
                dateOfBirth: "",
                citizenship: "",
                address: {
                    city: "",
                    postalCode: "",
                    streetName: "",
                    houseNumber: "",
                    building: "",
                    entrace: "",
                    floor: "",
                    door: ""
                },
                contracts: []
            },
            transaction: {},
            history: [],
            mode: {}
        }
        this.service = new BlockchainService();
    }

    componentDidMount() {
        if (this.props.match.path === '/persons/new') {
            this.setState({ 
                mode: Form.Mode.NEW
            });
        }
        else if (this.props.match.path === '/persons/detail/:id') {
            this.setState({ 
                mode: Form.Mode.LATEST
            });
            this.loadData(this.props.match.params.id);
        }
        else {
            this.setState({ 
                mode: Form.Mode.NONE
            });
        }
    }

    loadData(id) {
        this.service.listPerson(id).then(person => {
            this.setState({ 
                person: person.result.payload
            });
        });
        this.service.listPersonHistory(id).then(history => {
            var sortedHistory = history.result.payload;
            sortedHistory.sort(function(a, b) {    
                if (a["timeStamp"] > b["timeStamp"]) {    
                    return 1;    
                } else if (a["timeStamp"] < b["timeStamp"]) {    
                    return -1;    
                } else {
                    return 0;
                }    
            });
            this.setState({ 
                history: sortedHistory
            });
        });
        this.service.listPersonContracts(id).then(contracts => {
            this.setState({ 
                contracts: contracts.result.payload
            });
        });
    }

    onSave() {
        if (this.state.mode == Form.Mode.LATEST) {
            this.service.updatePerson(this.state.person).then(person => {
                this.props.history.goBack();
            });
        }
        else if (this.state.mode == Form.Mode.NEW) {
            this.service.createPerson(this.state.person).then(person => {
                this.props.history.goBack();
            });
        }
        else {
            console.log("Unable to save item in current mode!");
        }
    }

    onRemove() {
        if (this.state.mode == Form.Mode.LATEST) {
            this.service.deletePerson(this.state.person.taxIdentificationNumber).then(person => {
                this.props.history.goBack();
            });
        }
        else {
            console.log("Unable to remoce item in current mode!");
        }
    }

    onSelectHistoryVersion(i) {
        if (i < this.state.history.length - 1) {
            this.setState({ 
                mode: Form.Mode.HISTORY
            });
        }
        else {
            this.setState({ 
                mode: Form.Mode.LATEST
            });
        }
        this.setState({
            person: this.state.history[i].value,
            transaction: this.state.history[i]
        });
    }

    onCreateNewContract(e) {
        this.props.history.push('/contracts/new/predefined', { initPersonId: this.state.person.taxIdentificationNumber });
    }

    onSuspendAll() {
        if (this.state.mode == Form.Mode.LATEST) {
            this.service.suspendAllContract(this.state.person.taxIdentificationNumber, new Date()).then(contract => {
                this.props.history.goBack();
            });
        }
        else {
            console.log("Unable to remoce item in current mode!");
        }
    }

    goToDetails(e) {
        this.props.history.push('/contracts/detail/' + e.value.contractId);
    }

    binding(object, node, e) {
        this.setState({
            person: Binding.updateByString.bind(null, object, node, e.target.value).call()
        });
    }

    render() {
        const customizedContent = (item, i) => {
            return (
                <Button label={item.trxId.substring(0, 4)} className="p-button-link" onClick={this.onSelectHistoryVersion.bind(this, i)} />
            );
        };
        return (
            <div>
                <Card title="" className="wc">
                    <div className="p-grid">
                        <div className="p-col-12">
                            <Tag value={this.state.mode.name} />
                            <Tag value={"versions: " + this.state.history.length} />
                        </div>
                        {this.state.history.length > 1 && 
                            <div className="p-col-12">
                                <Timeline value={this.state.history} layout="horizontal" align="bottom" content={customizedContent} />
                                {this.state.mode === Form.Mode.HISTORY && 
                                    <div className="p-fluid p-formgrid p-grid">
                                        <div className="p-field p-col-12 p-md-4">
                                            <label htmlFor="trxId">TrxId</label>
                                            <InputText id="trxId" value={this.state.transaction.trxId} readOnly />
                                        </div>
                                        <div className="p-field p-col-12 p-md-4">
                                            <label htmlFor="timeStamp">Timestamp</label>
                                            <InputText id="timeStamp" value={DateUtil.timeConverter(this.state.transaction.timeStamp)} readOnly />
                                        </div>
                                        <div className="p-field p-col-12 p-md-4">
                                            <label htmlFor="isDelete">Deleted?</label>
                                            <InputText id="isDelete" value={this.state.transaction.isDelete} readOnly />
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                        {(this.state.mode === Form.Mode.LATEST || this.state.mode === Form.Mode.NEW || (this.state.mode === Form.Mode.HISTORY && !this.state.transaction.isDelete)) && 
                            <div className="p-col-12">
                                <Divider align="center" type="dashed">Person Details</Divider>
                                <div className="p-fluid p-formgrid p-grid">
                                    <div className="p-field p-col-12 p-md-6">
                                        <label htmlFor="taxIdentificationNumber">Tax Identification Number</label>
                                        <InputMask id="taxIdentificationNumber" unmask mask="9999999999" value={this.state.person.taxIdentificationNumber} onChange={this.binding.bind(this, this.state.person, 'taxIdentificationNumber')}></InputMask>
                                    </div>
                                    <div className="p-field p-col-12 p-md-6">
                                        <label htmlFor="tajNumber">TAJ Number</label>
                                        <InputMask id="tajNumber" unmask mask="999 999 999" value={this.state.person.tajNumber} onChange={this.binding.bind(this, this.state.person, 'tajNumber')}></InputMask>
                                    </div>
                                    <div className="p-field p-col-12 p-md-6">
                                        <label htmlFor="firstName">First Name</label>
                                        <InputText id="firstName" type="text" value={this.state.person.firstName} onChange={this.binding.bind(this, this.state.person, 'firstName')} />
                                    </div>
                                    <div className="p-field p-col-12 p-md-6">
                                        <label htmlFor="lastName">Last Name</label>
                                        <InputText id="lastName" type="text" value={this.state.person.lastName} onChange={this.binding.bind(this, this.state.person, 'lastName')} />
                                    </div>
                                    <div className="p-field p-col-12 p-md-6">
                                        <label htmlFor="dateOfBirth">Date Of Birth</label>
                                        <InputText id="dateOfBirth" type="text" value={this.state.person.dateOfBirth} onChange={this.binding.bind(this, this.state.person, 'dateOfBirth')} />
                                    </div>
                                    <div className="p-field p-col-12 p-md-6">
                                        <label htmlFor="citizenship">Citizenship</label>
                                        <InputText id="citizenship" type="text" value={this.state.person.citizenship} onChange={this.binding.bind(this, this.state.person, 'citizenship')} />
                                    </div>
                                </div>
                                <Divider align="center" type="dashed">Address</Divider>
                                {!!this.state.person.address && 
                                    <div className="p-fluid p-formgrid p-grid">
                                        <div className="p-field p-col-12 p-md-9">
                                            <label htmlFor="streetName">Street</label>
                                            <InputText id="streetName" type="text" value={this.state.person.address.streetName} onChange={this.binding.bind(this, this.state.person, 'address.streetName')} />
                                        </div>
                                        <div className="p-field p-col-12 p-md-3">
                                            <label htmlFor="houseNumber">Building Number</label>
                                            <InputText id="houseNumber" type="text" value={this.state.person.address.houseNumber} onChange={this.binding.bind(this, this.state.person, 'address.houseNumber')} />
                                        </div>
                                        <div className="p-field p-col-12 p-md-6">
                                            <label htmlFor="city">City</label>
                                            <InputText id="city" type="text" value={this.state.person.address.city} onChange={this.binding.bind(this, this.state.person, 'address.city')} />
                                        </div>
                                        <div className="p-field p-col-12 p-md-6">
                                            <label htmlFor="postalCode">Postal Code</label>
                                            <InputText id="postalCode" type="text" value={this.state.person.address.postalCode} onChange={this.binding.bind(this, this.state.person, 'address.postalCode')} />
                                        </div>
                                        <div className="p-field p-col-12 p-md-3">
                                            <label htmlFor="building">Building</label>
                                            <InputText id="building" type="text" value={this.state.person.address.building} onChange={this.binding.bind(this, this.state.person, 'address.building')} />
                                        </div>
                                        <div className="p-field p-col-12 p-md-3">
                                            <label htmlFor="entrace">Entrace</label>
                                            <InputText id="entrace" type="text" value={this.state.person.address.entrace} onChange={this.binding.bind(this, this.state.person, 'address.entrace')} />
                                        </div>
                                        <div className="p-field p-col-12 p-md-3">
                                            <label htmlFor="floor">Floor</label>
                                            <InputText id="floor" type="text" value={this.state.person.address.floor} onChange={this.binding.bind(this, this.state.person, 'address.floor')} />
                                        </div>
                                        <div className="p-field p-col-12 p-md-3">
                                            <label htmlFor="door">Door</label>
                                            <InputText id="door" type="text" value={this.state.person.address.door} onChange={this.binding.bind(this, this.state.person, 'address.door')} />
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                        <div className="p-col-12 button-container">
                            <Divider type="dashed"></Divider>
                            {(this.state.mode === Form.Mode.LATEST || this.state.mode === Form.Mode.NEW) && 
                                <Button label="Save Person" icon="pi pi-save" onClick={this.onSave.bind(this)} />
                            }
                            {this.state.mode === Form.Mode.LATEST && 
                                <Button label="Remove Person" className="p-button-danger" icon="pi pi-trash" onClick={this.onRemove.bind(this)} />
                            }
                            {this.state.mode === Form.Mode.LATEST && 
                                <Button label="Suspend All Contractw" icon="pi pi-pause" className="p-button-warning" onClick={this.onSuspendAll.bind(this)} />
                            }
                        </div>
                    </div>
                </Card>
                <Card title="Active Contracts" className="wc">
                    <div className="p-grid">
                        <div className="p-col-12">
                            <div className="p-col-12 button-container">
                                <Button label="Create Contract" icon="pi pi-plus" onClick={this.onCreateNewContract.bind(this)} />
                            </div>
                            <Divider type="dashed"></Divider>
                            <DataTable value={this.state.contracts} onSelectionChange={this.goToDetails.bind(this)} selectionMode="single" dataKey="taxNumber">
                                <Column field="contractId" header="Contract Id"></Column>
                                <Column field="contractDate" header="Date"></Column>
                                <Column field="employerId" header="Employer Id"></Column>
                            </DataTable>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }
}

export default PersonDetails;