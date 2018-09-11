import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import * as firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCfo84ei_WwIGTWkX5VH4Le8KfEQZ2qunQ",
  authDomain: "react-firebase-a77b2.firebaseapp.com",
  databaseURL: "https://react-firebase-a77b2.firebaseio.com",
  projectId: "react-firebase-a77b2",
  storageBucket: "",
};

firebase.initializeApp(firebaseConfig);

import { Container , Content, Header, Form, Input, Item, Button, Label } from 'native-base';

export default class App extends React.Component {

  constructor(props){
    super(props)

    this.state = ({
      email: '',
      password: ''
    })
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null){
        console.log(user);
      }
    })
  }
  signUpUser = (email, password) => {
    try {
      if (this.state.password.length < 6) {
        alert("Please enter atleast 6 characters")
        return;
      }

      firebase.auth().createUserWithEmailAndPassword(email, password)

    } catch (error) {
      console.log(error.toString()); 
    }
  }

  loginUser = (email, password) => {
    try {
      firebase.auth().signInWithEmailAndPassword(email, password).then(function (user){
        console.log(user);
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in.
            alert('User is signed in..');
          }else{
            alert('User not signed in');
          }
        });
      })
    } catch (error) {
      console.log(error.toString())
    }
  }

  async loginWithFacebook() {
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('1037663006393334', { permissions: ['public_profile'] })

    if (type === 'success'){

      //const credential = firebase.auth.FacebookAuthProvider.credential(token)

      //firebase.auth().signInWithCredential(credential).catch((error) => {
      //  console.log(error)
      //})
      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}`);
      Alert.alert(
        'Logged in!',
        `Hi ${(await response.json()).name}!`,
      );

      firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    }
  }

  render() {
    return (
      <Container style={styles.container}>
        <Form>
          <Item floatingLabel>
            <Label>Email</Label>
            <Input
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={(email) => this.setState({ email })}
              />
          </Item>
          <Item floatingLabel>
            <Label>Senha</Label>
            <Input
              secureTextEntry={true}
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={(password) => this.setState({ password })}
              />
          </Item>
          <Button style={styles.buttonLogin}
            full
            rounded
            success
            onPress={()=> this.loginUser(this.state.email,this.state.password)}
          >
            <Text style={styles.textLogin}>Login</Text>
          </Button>
          <Button style={styles.buttonLogin}
            full
            rounded
            primary
            onPress={()=> this.signUpUser(this.state.email,this.state.password)}
          >
            <Text style={styles.textLogin}>Sign Up</Text>
          </Button>
          <Button style={styles.buttonLogin}
            full
            rounded
            primary
            onPress={() => this.loginWithFacebook()}
          >
            <Text style={styles.textLogin}>Login with Facebook</Text>
          </Button>
        </Form>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 10
  },
  buttonLogin: {
    marginTop: 10,
  },
  textLogin: {
    color: 'white',
  }
});
