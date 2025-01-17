import React, { Component } from 'react';
import './Auth.css';
import '../index.css';
import AuthContext from '../context/auth-context';

class AuthPage extends Component{
    state = {
        isLogin : true
    }

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    switchModeHandler = () => {
        this.setState(prevState => {
            return { isLogin: !prevState.isLogin};
        });
    };

    submitHandler = (event) => {
        event.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;

        if(email.trim().length === 0 || password.trim().length ===0) return;
        console.log(email, password)

        let requestBody = {
            query : `
            query {
                login(email:"${email}", password: "${password}") {
                    userId
                    token
                    tokenExpiration
                }
            }`
        }

        if(this.state.isLogin) {
            requestBody = {
                query: `
                    mutation {
                        createUser(userInput:{email:"${email}", password: "${password}"}) {
                            _id
                            email
                        }
                    }
                `
            };
        }

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body:JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res =>{
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Error');
            }
            return res.json();
        })
        .then(resData => {
            console.log(resData);
            if(resData.data.login.token) {
                this.context.login(
                    resData.data.login.token,
                    resData.data.login.userId,
                    resData.data.login.tokenExpiration)
            }
        })
        .catch(err => console.log(err));
    }


    render() {
        return (
            <form className="auth-form">
                <div className="form-control">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" ref={this.emailEl}></input>
                </div>
                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" ref={this.passwordEl}></input>
                </div>
                <div className="actions">
                <button type="button" onClick={this.switchModeHandler}>
            Switch to {this.state.isLogin ? 'Signup' : 'Login'}</button>
                    <button type="submit" onClick={this.submitHandler}>Submit</button>
                </div>
            </form>
        );
    }
}
export default AuthPage;