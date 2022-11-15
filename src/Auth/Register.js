import React, { Component, Fragment } from 'react';
import { View, Text } from 'react-native';
import { Input, TextLink, Loading, Button } from './common';
import axios from 'axios';
import deviceStorage from '../services/deviceStorage';

class Registration extends Component {
    constructor(props){
        
        // code omitted
        
      this.registerUser = this.registerUser.bind(this);
    }
  
    registerUser() {
      const { email, password, password_confirmation } = this.state;
  
      this.setState({ error: '', loading: true });
      axios.post("http://localhost:4000/api/v1/sign_up",{
        user: {
            email: email,
            password: password,
            password_confirmation: password_confirmation
        }
        },)
        .then((response) => {
          console.log(response);
          deviceStorage.saveKey("id_token", response.data.jwt);
        // Handle the JWT response here
        })
        .catch((error) => {
        // Handle returned errors here
        });
    }

}
