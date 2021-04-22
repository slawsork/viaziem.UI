import React from 'react';
import { authenticationService, userService } from '@/_services';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';


class AdminPage extends React.Component {
    
    constructor(props) {
        super(props);

        const allowed = authenticationService.currentUserValue.role === 'Admin';
        
        this.state = {
            users: null,
            allowed: allowed
        };

        if (allowed){
            userService.getAll().then(users => {
                this.setState({ users })
            });
        }
    }

    render() {
        const  { allowed } = this.state;

        const handleToggle = (value) => () => {
            let user = this.state.users.find(item => item.email === value.email);
            user.active = !value.active;

            this.setState({});

            userService.setUserStatus(value);
          };
        
        return (
            
            <div>             
                {allowed &&
                <div>
                    <h2>Manage tools:</h2>
                    <List component="nav" aria-label="main mailbox folders">
                    </List>
                    {this.state.users &&
                    <div>
                        <h3>Manage users:</h3>
                        {this.state.users.map(user =>
                                <List component="nav" aria-label="main mailbox folders">
                                <ListItemText>{user.email}</ListItemText>
                                <ListItemText>{user.active ? "Active" : "Inactive"}</ListItemText>
                                <ListItemSecondaryAction>
                                <Switch
                                    edge="end"
                                    onChange={handleToggle(user)}
                                    checked={user.active}
                                    inputProps={{ 'aria-labelledby': 'switch-list-label-wifi' }}
                                />
                                </ListItemSecondaryAction>
                            </List>
                            )}
                    </div>
                }
                </div>
                }


            </div>
        )
    }
}

export { AdminPage }; 