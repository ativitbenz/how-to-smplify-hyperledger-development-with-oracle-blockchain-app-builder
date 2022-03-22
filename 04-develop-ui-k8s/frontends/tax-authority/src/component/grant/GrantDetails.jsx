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

class GrantDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grant: {
                leaveId: "",
                leaveDate: "",
                personId: "",
                employerId: "",
                leaveStart: ""
            },
            transaction: {},
            history: [],
            mode: {}
        }
        this.service = new BlockchainService();
    }

    componentDidMount() {
        if (this.props.match.path === '/grants/new') {
            this.setState({ 
                mode: Form.Mode.NEW
            });
        }
        else if (this.props.match.path === '/grants/detail/:id') {
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
        this.service.listLeave(id).then(body => {
            this.setState({ 
                grant: body.result.payload
            });
        });

    }

    onSave() {
        if (this.state.mode == Form.Mode.LATEST) {
            this.service.updatePerson(this.state.grant).then(grant => {
                this.props.history.goBack();
            });
        }
        else if (this.state.mode == Form.Mode.NEW) {
            this.service.createLeave(this.state.grant.personId, this.state.grant.employerId, this.state.grant.leaveDate, this.state.grant.leaveId).then(grant => {
                this.props.history.goBack();
            });
        }
        else {
            console.log("Unable to save item in current mode!");
        }
    }

    binding(object, node, e) {
        this.setState({
            grant: Binding.updateByString.bind(null, object, node, e.target.value).call()
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
                        </div>
                        {(this.state.mode === Form.Mode.LATEST || this.state.mode === Form.Mode.NEW || (this.state.mode === Form.Mode.HISTORY && this.state.transaction.isDelete == false)) && 
                            <div className="p-col-12">
                                <Divider align="center" type="dashed">Person Details</Divider>
                                <div className="p-fluid p-formgrid p-grid">
                                    <div className="p-field p-col-12 p-md-6">
                                        <label htmlFor="leaveId">Grant Id</label>
                                        <InputText id="leaveId" value={this.state.grant.leaveId} onChange={this.binding.bind(this, this.state.grant, 'leaveId')}></InputText>
                                    </div>
                                    <div className="p-field p-col-12 p-md-6">
                                        <label htmlFor="leaveDate">Grant Date</label>
                                        <InputText id="leaveDate" type="text" value={this.state.grant.leaveDate} onChange={this.binding.bind(this, this.state.grant, 'leaveDate')} />
                                    </div>
                                    <div className="p-field p-col-12 p-md-4">
                                        <label htmlFor="personId">Person Tax ID Number</label>
                                        <InputMask id="personId" unmask mask="9999999999" value={this.state.grant.personId} onChange={this.binding.bind(this, this.state.grant, 'personId')}></InputMask>
                                    </div>
                                    <div className="p-field p-col-12 p-md-4">
                                        <label htmlFor="employerId">Employer Tax Number</label>
                                        <InputMask id="employerId" unmask mask="99999999-9-99" value={this.state.grant.employerId} onChange={this.binding.bind(this, this.state.grant, 'employerId')}></InputMask>
                                    </div>
                                    <div className="p-field p-col-12 p-md-4">
                                        <label htmlFor="leaveStart">Leave Start</label>
                                        <InputText id="leaveStart" type="text" value={this.state.grant.leaveStart} onChange={this.binding.bind(this, this.state.grant, 'leaveStart')} />
                                    </div>
                                </div>
                            </div>
                        }
                        <div className="p-col-12 button-container">
                            <Divider type="dashed"></Divider>
                            {(this.state.mode === Form.Mode.LATEST || this.state.mode === Form.Mode.NEW) && 
                                <Button label="Save Grant" icon="pi pi-save" onClick={this.onSave.bind(this)} />
                            }
                        </div>
                    </div>
                </Card>
            </div>
        );
    }
}

export default GrantDetails;