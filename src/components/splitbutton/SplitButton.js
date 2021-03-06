import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Button} from '../button/Button';
import classNames from 'classnames';
import DomHandler from '../utils/DomHandler';
import { SplitButtonItem } from './SplitButtonItem';
import { SplitButtonPanel } from './SplitButtonPanel';
import Tooltip from "../tooltip/Tooltip";

export class SplitButton extends Component {

    static defaultProps = {
        id: null,
        label: null,
        icon: null,
        model: null,
        disabled: null,
        style: null,
        className: null,
        menuStyle: null,
        menuClassName: null,
        tabIndex: null,
        onClick: null,
        appendTo: null,
        tooltip: null,
        tooltipOptions: null
    }

    static propsTypes = {
        id: PropTypes.string,
        label: PropTypes.string,
        icon: PropTypes.string,
        model: PropTypes.array,
        disabled: PropTypes.bool,
        style: PropTypes.object,
        className: PropTypes.string,
        menustyle: PropTypes.object,
        menuClassName: PropTypes.string,
        tabIndex: PropTypes.string,
        onClick: PropTypes.func,
        appendTo: PropTypes.object,
        tooltip: PropTypes.string,
        tooltipOptions: PropTypes.object
    }

    constructor(props) {
        super(props);

        this.onDropdownButtonClick = this.onDropdownButtonClick.bind(this);
    }
    
    onDropdownButtonClick(event) {
        if(this.documentClickListener) {
            this.dropdownClick = true;
        }

        if(this.panel.element.offsetParent)
            this.hide();
        else
            this.show();
    }
        
    show() {
        this.panel.element.style.zIndex = String(DomHandler.generateZIndex());
        this.alignPanel();
        DomHandler.fadeIn(this.panel.element, 250);
        this.panel.element.style.display = 'block';
        this.bindDocumentListener();
    }
    
    hide() {
        this.panel.element.style.display = 'none';
        this.unbindDocumentListener();
    }

    alignPanel() {
        if (this.props.appendTo) {
            DomHandler.absolutePosition(this.panel.element, this.container);
            this.panel.element.style.minWidth = DomHandler.getWidth(this.container) + 'px';
        }
        else {
            DomHandler.relativePosition(this.panel.element, this.container);
        }
    }

    bindDocumentListener() {
        if(!this.documentClickListener) {
            this.documentClickListener = () => {
                if(this.dropdownClick)
                    this.dropdownClick = false;
                else
                    this.hide();
            };

            document.addEventListener('click', this.documentClickListener);
        }
    }

    unbindDocumentListener() {
        if(this.documentClickListener) {
            document.removeEventListener('click', this.documentClickListener);
            this.documentClickListener = null;
        }
    }

    componentDidMount() {
        if (this.props.tooltip) {
            this.tooltip = new Tooltip({
                target: this.container,
                content: this.props.tooltip,
                options: this.props.tooltipOptions
            });
        }
    }

    componentWillUnmount() {
        this.unbindDocumentListener();

        if (this.tooltip) {
            this.tooltip.destroy();
            this.tooltip = null;
        }
    }

    renderItems() {
        if (this.props.model) {
            return this.props.model.map((menuitem, index) => {
                return <SplitButtonItem menuitem={menuitem} key={index} />
            });
        }
        else {
            return null;
        }
    }
    
    render() {
        let className = classNames('p-splitbutton p-buttonset p-component', this.props.className, {'p-disabled': this.props.disabled});
        let items = this.renderItems(); 
        
        return (
            <div id={this.props.id} className={className} style={this.props.style}  ref={(el) => { this.container = el; }}>
                <Button type="button" icon={this.props.icon} label={this.props.label} onClick={this.props.onClick} disabled={this.props.disabled} tabIndex={this.props.tabIndex}></Button>
                <Button type="button" className="p-splitbutton-menubutton" icon="pi pi-caret-down" onClick={this.onDropdownButtonClick} disabled={this.props.disabled}></Button>
                <SplitButtonPanel ref={(el) => this.panel = el} appendTo={this.props.appendTo} 
                                menuStyle={this.props.menuStyle} menuClassName={this.props.menuClassName}>
                    {items}
                </SplitButtonPanel>
            </div>
        );
    }
}