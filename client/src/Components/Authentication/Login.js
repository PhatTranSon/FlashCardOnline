import React from 'react';
import Panel from './Panel';

import {
    Link
} from 'react-router-dom';

class Login extends React.Component {
    onFormSubmit() {

    }

    render() {
        return (
            <Panel>
                <div>
                    <h1 id="right-panel-title">Log in to <span className="blue-underlined">MyCard</span></h1>
                    <form onSubmit={this.onFormSubmit}>
                        <div className="field authentication-field">
                            <label className="label blue-label">Username</label>
                            <div className="control">
                                <input className="input round-input" type="text" placeholder="Choose username"/>
                            </div>
                        </div>

                        <div className="field authentication-field">
                            <label className="label blue-label">Password</label>
                            <div className="control">
                                <input className="input round-input" type="text" placeholder="Choose username"/>
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