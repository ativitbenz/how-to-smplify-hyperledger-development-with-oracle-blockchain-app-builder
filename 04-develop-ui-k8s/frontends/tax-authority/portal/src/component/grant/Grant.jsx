import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { BlockchainService } from '../../service/BlockchainService'

class Grant extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grants: []
        }
        this.service = new BlockchainService();
    }

    componentWillMount() {
        this.loadData();
    }

    loadData() {
        this.service.listLeaves().then(body => {
            this.setState({ 
                grants: body.result.payload
            });
        });
    }

    goToDetails(e) {
        this.props.history.push(window.location.pathname + '/detail/' + e.value.leaveId);
    }

    onCreateNew(e) {
        this.props.history.push(window.location.pathname + '/new');
    }

    render() {
        return (
            <Card title="" className="wc">
                <div className="p-grid">
                    <div className="p-col-12">
                        <div className="p-col-12 button-container">
                            <Button label="Create Grant" icon="pi pi-plus" onClick={this.onCreateNew.bind(this)} />
                        </div>
                        <Divider type="dashed"></Divider>
                        <DataTable value={this.state.grants} onSelectionChange={this.goToDetails.bind(this)} selectionMode="single" dataKey="leaveId">
                            <Column field="leaveId" header="Grant Id"></Column>
                            <Column field="personId" header="Person Id"></Column>
                            <Column field="leaveStart" header="Grant Start Date"></Column>
                        </DataTable>
                    </div>
                </div>
            </Card>
        );
    }
}

export default Grant;