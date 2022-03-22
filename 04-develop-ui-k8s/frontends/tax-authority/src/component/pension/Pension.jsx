import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Timeline } from 'primereact/timeline';
import { BlockchainService } from '../../service/BlockchainService'

class Pension extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contracts: []
        }
        this.service = new BlockchainService();
        this.events = [
            { status: 'Ordered', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0', image: 'game-controller.jpg' },
            { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
            { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-shopping-cart', color: '#FF9800' },
            { status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B' }
        ];
    }

    componentWillMount() {
        this.loadData();
    }

    loadData() {
        this.service.listPersonContracts('4444444444').then(body => {
            this.setState({ 
                contracts: body.result.payload
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
                        </div>
                        <Divider type="dashed"></Divider>
                        <Timeline value={this.state.contracts} opposite={(item) => item.contractDate} content={(item) => <small className="p-text-secondary">{item.employerId}</small>} />
                    </div>
                </div>
            </Card>
        );
    }
}

export default Pension;