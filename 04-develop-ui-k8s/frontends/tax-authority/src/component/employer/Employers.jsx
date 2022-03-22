import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { BlockchainService } from '../../service/BlockchainService'

class Employers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employers: []
        }
        this.service = new BlockchainService();
    }

    componentWillMount() {
        this.loadData();
    }

    loadData() {
        this.service.listEmployers().then(employers => {
            console.log(employers);
            this.setState({ 
                employers: employers.result.payload
            });
        });
    }

    goToDetails(e) {
        this.props.history.push(window.location.pathname + '/detail/' + e.value.taxNumber);
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
                            <Button label="Create Employer" icon="pi pi-plus" onClick={this.onCreateNew.bind(this)} />
                        </div>
                        <Divider type="dashed"></Divider>
                        <DataTable value={this.state.employers} onSelectionChange={this.goToDetails.bind(this)} selectionMode="single" dataKey="taxNumber">
                            <Column field="taxNumber" header="Tax Number"></Column>
                            <Column field="name" header="Name"></Column>
                            <Column field="email" header="Email"></Column>
                        </DataTable>
                    </div>
                </div>
            </Card>
        );
    }
}

export default Employers;