import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { BlockchainService } from '../../service/BlockchainService'

class Contract extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contracts: []
        }
        this.service = new BlockchainService();
    }

    componentWillMount() {
        this.loadData();
    }

    loadData() {
        this.service.listContracts().then(contracts => {
            this.setState({ 
                contracts: contracts.result.payload
            });
        });
    }

    goToDetails(e) {
        this.props.history.push(window.location.pathname + '/detail/' + e.value.contractId);
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
                            <Button label="Create Contract" icon="pi pi-plus" onClick={this.onCreateNew.bind(this)} />
                        </div>
                        <Divider type="dashed"></Divider>
                        <DataTable value={this.state.contracts} onSelectionChange={this.goToDetails.bind(this)} selectionMode="single" dataKey="contractId">
                            <Column field="contractId" header="Contract Id"></Column>
                            <Column field="contractDate" header="Date"></Column>
                            <Column field="personId" header="Person Id"></Column>
                            <Column field="employerId" header="Employer Id"></Column>
                        </DataTable>
                    </div>
                </div>
            </Card>
        );
    }
}

export default Contract;