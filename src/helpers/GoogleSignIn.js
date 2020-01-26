import React, { Component } from 'react';
import { analytics } from '../Config';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class GoogleSignIn extends Component {


  state = {
    isLogedIn: false
  };

  onSuccess() {
    if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
      this.props.logedIn(true);
    }
  }

  getContent() {
    if (!this.state.isLogedIn) {
      return (
        <Dialog open={true} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" >
          <DialogTitle id="alert-dialog-title">{"Login to your Google Account"}</DialogTitle>
          <DialogContent>
            <div id="loginButton">Login with Google</div>
          </DialogContent>
        </Dialog>
      )
    }
  }

  componentDidMount() {
    const self = this;
    setTimeout(function () {
      window.gapi.load('client:auth2', _ => { // load auth2
        this.auth2 = window.gapi.auth2.init({  //init auth2
          client_id: analytics.client_id,
        }).then(() => {

          if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) { // IF ITS LOGGED IN 
            self.setState({
              isLogedIn: true
            })
            self.onSuccess()
          } else {
            window.gapi.load('signin2', function () {
              window.gapi.signin2.render('loginButton')
            });

            window.gapi.auth2.getAuthInstance().signIn().then(() => { 
              if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
                self.onSuccess()
              }
            })
          }

        })

      });
    }, 200);

  }

  render() {
    return (
      <div>
        {this.getContent()}
      </div>
    );
  };
}




