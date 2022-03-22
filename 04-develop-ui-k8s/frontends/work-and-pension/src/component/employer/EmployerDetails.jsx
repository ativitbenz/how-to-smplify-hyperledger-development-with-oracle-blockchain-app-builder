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

class EmployerDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employer: {
                taxNumber: "",
                name: "",
                phone: "",
                email: "",
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
            mode: {},
            contracts: []
        }
        this.service = new BlockchainService();
    }

    componentDidMount() {
        if (this.props.match.path === '/employers/new') {
            this.setState({ 
                mode: Form.Mode.NEW
            });
        }
        else if (this.props.match.path === '/employers/detail/:id') {
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
        this.service.listEmployer(id).then(employer => {
            console.log(employer);
            this.setState({ 
                employer: employer.result.payload
            });
        });
        this.service.listEmployerHistory(id).then(history => {
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
        this.service.listEmployerContracts(id).then(contracts => {
            console.log(contracts.result.payload);
            this.setState({ 
                contracts: contracts.result.payload
            });
        });
    }

    onSave() {
        if (this.state.mode == Form.Mode.LATEST) {
            this.service.updateEmployer(this.state.employer).then(employer => {
                this.props.history.goBack();
            });
        }
        else if (this.state.mode == Form.Mode.NEW) {
            this.service.createEmployer(this.state.employer).then(employer => {
                this.props.history.goBack();
            });
        }
        else {
            console.log("Unable to save item in current mode!");
        }
    }

    onRemove() {
        if (this.state.mode == Form.Mode.LATEST) {
            this.service.deleteEmployer(this.state.employer.taxNumber).then(employer => {
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
            employer: this.state.history[i].value,
            transaction: this.state.history[i]
        });
    }

    onCreateNewContract(e) {
        this.props.history.push('/contracts/new/predefined', { initEmployerId: this.state.employer.taxNumber });
    }

    goToDetails(e) {
        this.props.history.push('/contracts/detail/' + e.value.contractId);
    }

    binding(object, node, e) {
        this.setState({
            employer: Binding.updateByString.bind(null, object, node, e.target.value).call()
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
                                <Divider align="center" type="dashed">Employer Details</Divider>
                                <div className="p-fluid p-formgrid p-grid">
                                    <div className="p-field p-col-12">
                                        <label htmlFor="taxNumber">Tax Number</label>
                                        <InputMask id="taxNumber" unmask mask="99999999-9-99" value={this.state.employer.taxNumber} onChange={this.binding.bind(this, this.state.employer, 'taxNumber')}></InputMask>
                                    </div>
                                    <div className="p-field p-col-12">
                                        <label htmlFor="name">Company Name</label>
                                        <InputText id="name" type="text" value={this.state.employer.name} onChange={this.binding.bind(this, this.state.employer, 'name')} />
                                    </div>
                                    <div className="p-field p-col-12 p-md-6">
                                        <label htmlFor="email">Email</label>
                                        <InputText id="email" type="text" value={this.state.employer.email} onChange={this.binding.bind(this, this.state.employer, 'email')} />
                                    </div>
                                    <div className="p-field p-col-12 p-md-6">
                                        <label htmlFor="phone">Phone</label>
                                        <InputText id="phone" type="text" value={this.state.employer.phone} onChange={this.binding.bind(this, this.state.employer, 'phone')} />
                                    </div>
                                </div>
                                <Divider align="center" type="dashed">Address</Divider>
                                <div className="p-fluid p-formgrid p-grid">
                                    <div className="p-field p-col-12 p-md-9">
                                        <label htmlFor="streetName">Street</label>
                                        <InputText id="streetName" type="text" value={this.state.employer.address.streetName} onChange={this.binding.bind(this, this.state.employer, 'address.streetName')} />
                                    </div>
                                    <div className="p-field p-col-12 p-md-3">
                                        <label htmlFor="houseNumber">Building Number</label>
                                        <InputText id="houseNumber" type="text" value={this.state.employer.address.houseNumber} onChange={this.binding.bind(this, this.state.employer, 'address.houseNumber')} />
                                    </div>
                                    <div className="p-field p-col-12 p-md-6">
                                        <label htmlFor="city">City</label>
                                        <InputText id="city" type="text" value={this.state.employer.address.city} onChange={this.binding.bind(this, this.state.employer, 'address.city')} />
                                    </div>
                                    <div className="p-field p-col-12 p-md-6">
                                        <label htmlFor="postalCode">Postal Code</label>
                                        <InputText id="postalCode" type="text" value={this.state.employer.address.postalCode} onChange={this.binding.bind(this, this.state.employer, 'address.postalCode')} />
                                    </div>
                                    <div className="p-field p-col-12 p-md-3">
                                        <label htmlFor="building">Building</label>
                                        <InputText id="building" type="text" value={this.state.employer.address.building} onChange={this.binding.bind(this, this.state.employer, 'address.building')} />
                                    </div>
                                    <div className="p-field p-col-12 p-md-3">
                                        <label htmlFor="entrace">Entrace</label>
                                        <InputText id="entrace" type="text" value={this.state.employer.address.entrace} onChange={this.binding.bind(this, this.state.employer, 'address.entrace')} />
                                    </div>
                                    <div className="p-field p-col-12 p-md-3">
                                        <label htmlFor="floor">Floor</label>
                                        <InputText id="floor" type="text" value={this.state.employer.address.floor} onChange={this.binding.bind(this, this.state.employer, 'address.floor')} />
                                    </div>
                                    <div className="p-field p-col-12 p-md-3">
                                        <label htmlFor="door">Door</label>
                                        <InputText id="door" type="text" value={this.state.employer.address.door} onChange={this.binding.bind(this, this.state.employer, 'address.door')} />
                                    </div>
                                </div>
                            </div>
                        }
                        <div className="p-col-12 button-container">
                            <Divider type="dashed"></Divider>
                            {(this.state.mode === Form.Mode.LATEST || this.state.mode === Form.Mode.NEW) && 
                                <Button label="Save Employer" icon="pi pi-save" onClick={this.onSave.bind(this)} />
                            }
                            {this.state.mode === Form.Mode.LATEST && 
                                <Button label="Remove Employer" className="p-button-danger" icon="pi pi-trash" onClick={this.onRemove.bind(this)} />
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
                                <Column field="personId" header="Person Id"></Column>
                            </DataTable>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }
}

export default EmployerDetails;