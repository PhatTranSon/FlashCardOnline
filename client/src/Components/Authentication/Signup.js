import React from 'react';
import Panel from './Panel';

class Signup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: false,
            errorMessage: ""
        }
    }

    onFormSubmit() {
        
    }

    render() {
        return (
            <Panel>
                <div>
                    <h1 id="right-panel-title">Sign up to <span className="blue-underlined">MyCard</span></h1>
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

                        <div className="field authentication-field">
                            <label className="label blue-label">Confirm password</label>
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
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </Panel>
        )
    }
}

export default Signup;