import React, {Component} from "react";
import { TabMenu } from 'primereact/tabmenu';

class MainMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    activeItem() {
        if (window.location.pathname.startsWith("/persons"))
            return this.props.items[1];
        else if (window.location.pathname.startsWith("/pensions"))
            return this.props.items[2];
        else if (window.location.pathname.startsWith("/grants"))
            return this.props.items[3];
        else
            return null;
    }

    render() {
        return (
            [<div className="tesla-bar tesla-bar-side">
                <div className="tesla-width-limiter">
                    <TabMenu model={this.props.items} key={(item) => item.label} activeItem={this.activeItem()}/>
                </div>
            </div>]
        );
    }
}

export default MainMenu;