import React, { Component } from 'react';
import { Icon, IconButton, Tooltip } from '@material-ui/core';

class MyAction extends Component {
    render() {
        let action = this.props.action;
        if (typeof action === 'function') {
            action = action(this.props.data);
            if (!action) {
                return null;
            }
        }

        const handleOnClick = event => {
            if (action.onClick) {
                action.onClick(event, this.props.data);
                event.stopPropagation();
            }
        };

        const button = (
            <span>
                <IconButton
                    color="inherit"
                    disabled={action.disabled}
                    disableRipple
                    onClick={(event) => handleOnClick(event)}
                    style={{ backgroundColor: 'transparent' }}
                >
                    {typeof action.icon === "string" ? (
                        <Icon {...action.iconProps} fontSize="small">{action.icon}</Icon>
                    ) : (
                            <action.icon
                                {...action.iconProps}
                                disabled={action.disabled}
                            />
                        )
                    }
                </IconButton>
            </span>
        );

        if (action.tooltip) {
            return <Tooltip title={action.tooltip}>{button}</Tooltip>;
        } else {
            return button;
        }
    }
}

export default MyAction;