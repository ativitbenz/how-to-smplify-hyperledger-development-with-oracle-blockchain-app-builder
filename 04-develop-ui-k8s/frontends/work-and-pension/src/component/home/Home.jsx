import React, { Component } from 'react';
import { Card } from 'primereact/card';

class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="p-grid p-justify-center p-align-center max-height">
                <Card title="Home" className="p-col-12 p-md-9">
                    <div className="p-col-12">
                        API URL: {process.env.REACT_APP_API_URL}
                    </div>
                </Card>
            </div>
        );
    }
}

export default Home;