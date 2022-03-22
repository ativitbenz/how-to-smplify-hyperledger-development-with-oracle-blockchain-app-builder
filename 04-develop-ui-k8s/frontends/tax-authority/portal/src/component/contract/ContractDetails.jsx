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

class ContractDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contract: {
                contractId: "",
                contractDate: "",
                personId: "",
                employerId: "",
                weekWorkingHours: "",
                insuranceStart: "",
                insuranceEnd: "",
                suspensionStart: "",
                suspensionEnd: ""
            },
            transaction: {},
            history: [],
            mode: {},
            status: Form.ContractStatus.NONE,
            initPersonId: '',
            initEmployerId: ''
        }
        this.service = new BlockchainService();
    }

    componentDidMount() {
        if (this.props.match.path === '/contracts/new') {
            this.setState({ 
                mode: Form.Mode.NEW
            });
        }
        else if (this.props.match.path === '/contracts/new/predefined') {
            var contract = {...this.state.contract}
            contract.employerId = this.props.location.state.initEmployerId;
            contract.personId = this.props.location.state.initPersonId;
            this.setState({ 
                mode: Form.Mode.NEW,
                contract: contract
            });
        }
        else if (this.props.match.path === '/contracts/detail/:id') {
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
        this.service.listContract(id).then(contract => {
            if (!contract.result.payload.insuranceEnd) {
                if (!!contract.result.payload.suspensionStart && !contract.result.payload.suspensionEnd) {
                    this.setState({status: Form.ContractStatus.SUSPENDED});
                }
                else {
                    this.setState({status: Form.ContractStatus.ACTIVE});
                }
            }
            else {
                this.setState({status: Form.ContractStatus.COMPLETED});
            }
            this.setState({ 
                contract: contract.result.payload
            });
        });
        this.service.listContractHistory(id).then(history => {
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
    }

    onSave() {
        if (this.state.mode == Form.Mode.LATEST) {
            this.service.updateContract(this.state.contract.contractId, this.state.contract.weekWorkingHours, new Date()).then(contract => {
                this.props.history.goBack();
            });
        }
        else if (this.state.mode == Form.Mode.NEW) {
            var date = new Date();
            this.service.createContract(this.state.contract.personId, this.state.contract.employerId, this.state.contract.weekWorkingHours, this.state.contract.insuranceStart, date, date.getTime().toString()).then(contract => {
                this.props.history.goBack();
            });
        }
        else {
            console.log("Unable to save item in current mode!");
        }
    }

    onTerminate() {
        if (this.state.mode == Form.Mode.LATEST) {
            this.service.terminateContract(this.state.contract.contractId, new Date()).then(contract => {
                this.props.history.goBack();
            });
        }
        else {
            console.log("Unable to remoce item in current mode!");
        }
    }

    onSuspend() {
        if (this.state.mode == Form.Mode.LATEST) {
            this.service.suspendContract(this.state.contract.contractId, new Date()).then(contract => {
                this.props.history.goBack();
            });
        }
        else {
            console.log("Unable to remoce item in current mode!");
        }
    }

    onResume() {
        if (this.state.mode == Form.Mode.LATEST) {
            this.service.resumeContract(this.state.contract.contractId, new Date()).then(contract => {
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
            contract: this.state.history[i].value,
            transaction: this.state.history[i]
        });
    }

    binding(object, node, e) {
        this.setState({
            contract: Binding.updateByString.bind(null, object, node, e.target.value).call()
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
                            <Tag value={this.state.status.name} />
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
                                {this.state.mode !== Form.Mode.NEW && 
                                    <div className="p-fluid p-formgrid p-grid">
                                        <Divider align="center" type="dashed">Contract Details</Divider>
                                        <div className="p-field p-col-12 p-md-6">
                                            <label htmlFor="contractId">Contract Id</label>
                                            <InputMask id="contractId" unmask mask="9999999999999" value={this.state.contract.contractId} onChange={this.binding.bind(this, this.state.contract, 'contractId')}></InputMask>
                                        </div>
                                        <div className="p-field p-col-12 p-md-6">
                                            <label htmlFor="contractDate">Contract Create Date</label>
                                            <InputText id="contractDate" type="text" value={this.state.contract.contractDate} onChange={this.binding.bind(this, this.state.contract, 'contractDate')} />
                                        </div>
                                    </div>
                                }
                                <div className="p-fluid p-formgrid p-grid">
                                    <Divider align="center" type="dashed">Contract Details</Divider>
                                    <div className="p-field p-col-12 p-md-4">
                                        <label htmlFor="personId">Person Tax ID Number</label>
                                        <InputMask id="personId" unmask mask="9999999999" value={this.state.contract.personId} onChange={this.binding.bind(this, this.state.contract, 'personId')}></InputMask>
                                    </div>
                                    <div className="p-field p-col-12 p-md-4">
                                        <label htmlFor="employerId">Employer Tax Number</label>
                                        <InputMask id="employerId" unmask mask="99999999-9-99" value={this.state.contract.employerId} onChange={this.binding.bind(this, this.state.contract, 'employerId')}></InputMask>
                                    </div>
                                    <div className="p-field p-col-12 p-md-4">
                                        <label htmlFor="weekWorkingHours">Week Working Hours</label>
                                        <InputText id="weekWorkingHours" value={this.state.contract.weekWorkingHours}  onChange={this.binding.bind(this, this.state.contract, 'weekWorkingHours')} />
                                    </div>
                                    <Divider type="dashed" />
                                    <div className="p-field p-col-12 p-md-6">
                                        <label htmlFor="insuranceStart">Insurance Start Date</label>
                                        <InputText id="insuranceStart" value={this.state.contract.insuranceStart}  onChange={this.binding.bind(this, this.state.contract, 'insuranceStart')} />
                                    </div>
                                    <div className="p-field p-col-12 p-md-6">
                                        <label htmlFor="insuranceEnd">Insurance End Date</label>
                                        <InputText id="insuranceEnd" value={this.state.contract.insuranceEnd}  onChange={this.binding.bind(this, this.state.contract, 'insuranceEnd')}  />
                                    </div>
                                    <Divider type="dashed" />
                                    <div className="p-field p-col-12 p-md-6">
                                        <label htmlFor="suspensionStart">Suspension Start Date</label>
                                        <InputText id="suspensionStart" value={this.state.contract.suspensionStart}  onChange={this.binding.bind(this, this.state.contract, 'suspensionStart')} />
                                    </div>
                                    <div className="p-field p-col-12 p-md-6">
                                        <label htmlFor="suspensionEnd">Suspension End Date</label>
                                        <InputText id="suspensionEnd" value={this.state.contract.suspensionEnd}  onChange={this.binding.bind(this, this.state.contract, 'suspensionEnd')}  />
                                    </div>
                                </div>
                            </div>
                        }
                        <div className="p-col-12 button-container">
                            <Divider type="dashed"></Divider>
                            {(this.state.mode === Form.Mode.LATEST || this.state.mode === Form.Mode.NEW) && 
                                <Button label="Save Contract" icon="pi pi-save" onClick={this.onSave.bind(this)} />
                            }
                            {this.state.mode === Form.Mode.LATEST && this.state.status === Form.ContractStatus.ACTIVE && 
                                <Button label="Terminate Contract" icon="pi pi-ban" className="p-button-danger" onClick={this.onTerminate.bind(this)} />
                            }
                            {this.state.mode === Form.Mode.LATEST && this.state.status === Form.ContractStatus.ACTIVE && 
                                <Button label="Suspend Contract" icon="pi pi-pause" className="p-button-warning" onClick={this.onSuspend.bind(this)} />
                            }
                            {this.state.mode === Form.Mode.LATEST && this.state.status === Form.ContractStatus.SUSPENDED && 
                                <Button label="Resume Contract" icon="pi pi-play" className="p-button-warning" onClick={this.onResume.bind(this)} />
                            }
                        </div>
                    </div>
                </Card>
            </div>
        );
    }
}

export default ContractDetails;