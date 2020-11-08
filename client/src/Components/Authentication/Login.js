import React from 'react';
import Panel from './Panel';

import {
    Link
} from 'react-router-dom';

import { login } from '../../Common/Authentication';

class Login extends React.Component {
    constructor(props) {
        super(props);

        //Create states
        this.state = {
            error: false,
            errorMessage: ""
        }

        //Bind method
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    onFormSubmit(event) {
        //Prevent form reload
        event.preventDefault();

        //Get the data from form data
        const formData = new FormData(event.target);

        //Get the data
        const name = formData.get('name');
        const password = formData.get('password');

        //Call login function
        login(name, password)
            .then(response => {
                //Successful login
                console.log('yes');
            })
            .catch(error => {
                //Get error
                const data = error.response.data;
                const status = error.response.status;

                //Set state
                if (status === 500) {
                    this.setState({
                        error: true,
                        errorMessage: data.message
                    });
                } else {
                    this.setState({
                        error: true,
                        errorMessage: "Something went wrong. Please try again"
                    });
                }
            })
    }

    render() {
        return (
            <Panel>
                <div>
                    <h1 id="right-panel-title">Log in to <span className="blue-underlined">MyCard</span></h1>
                    {
                        this.state.error ? 
                            <div className="form-error-message">
                                { this.state.errorMessage }
                            </div> : null
                    }
                    <form onSubmit={this.onFormSubmit}>
                        <div className="field authentication-field">
                            <label className="label blue-label">Username</label>
                            <div className="control">
                                <input className="input round-input" name="name" type="text" placeholder="Enter username"/>
                            </div>
                        </div>

                        <div className="field authentication-field">
                            <label className="label blue-label">Password</label>
                            <div className="control">
                                <input className="input round-input" name="password" type="password" placeholder="Enter password"/>
                            </div>
                        </div>

                        <div className="control">
                            <button 
                                type="submit" 
                                className="button blue-button"
                                style={{width: "100%"}}
                            >
                                Login
                            </button>
                        </div>
                    </form>
                    <div id="signup-prompt">
                        Don't have an account ?&nbsp;
                        <Link to="/signup">
                            Sign up
                        </Link>
                    </div>
                </div>
            </Panel>
        )
    }
}

export default Login;