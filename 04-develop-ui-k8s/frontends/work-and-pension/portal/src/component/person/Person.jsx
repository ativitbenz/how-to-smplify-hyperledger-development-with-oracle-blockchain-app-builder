import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { BlockchainService } from '../../service/BlockchainService'

class Person extends Component {
    constructor(props) {
        super(props);
        this.state = {
            persons: []
        }
        this.service = new BlockchainService();
    }

    componentWillMount() {
        this.loadData();
    }

    loadData() {
        this.service.listPersons().then(body => {
            this.setState({ 
                persons: body.result.payload
            });
        });
    }

    goToDetails(e) {
        this.props.history.push(window.location.pathname + '/detail/' + e.value.taxIdentificationNumber);
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
                            <Button label="Create Person" icon="pi pi-plus" onClick={this.onCreateNew.bind(this)} />
                        </div>
                        <Divider type="dashed"></Divider>
                        <DataTable value={this.state.persons} onSelectionChange={this.goToDetails.bind(this)} selectionMode="single" dataKey="taxIdentificationNumber">
                            <Column field="taxIdentificationNumber" header="Tax Identification Number"></Column>
                            <Column field="firstName" header="First Name"></Column>
                            <Column field="lastName" header="Person Id"></Column>
                        </DataTable>
                    </div>
                </div>
            </Card>
        );
    }
}

export default Person;