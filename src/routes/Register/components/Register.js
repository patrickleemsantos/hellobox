import React, { Component } from 'react';
import { Actions } from "react-native-router-flux";
import {
  StyleSheet,
  View,
  Image,
  Alert,
  AsyncStorage,
  KeyboardAvoidingView
} from 'react-native';
import { Spinner, Container, Content, Body, Left, Right, Text, Header, Button, Title, Footer, FooterTab, Item, Input, Form, Label, Card, CardItem } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome';
// var Spinner = require("react-native-spinkit");

export default class Register extends Component {    
    componentDidUpdate() {
        if (this.props.registerStatus == true) {
            AsyncStorage.getItem('account', (err, result) => {
                if (result) {
                    Actions.login();
                }
            });
        }
    }

    render() {
        function handleFirstName (value) {
            this.props.setFirstName(value);
        }

        function handleLastName (value) {
            this.props.setLastName(value);
        }

        function handleMobileNumber (value) {
            this.props.setMobileNumber(value);
        }

        function handleEmail (value) {
            this.props.setEmail(value);
        }

        function handlePassword (value) {
            this.props.setPassword(value);
        }
        
        return (
            <Container>
            <Header style={{backgroundColor: "#E90000"}} iosBarStyle="light-content" androidStatusBarColor="#E90000">
                <Left>
                    <Button transparent onPress={() => Actions.pop()}>
                        <Icon name="arrow-left" style={styles.menu} />
                    </Button>
                </Left>
                <Body>
                    <Text style={styles.headerText}>Register</Text>
                </Body>
                <Right>
                </Right>
            </Header>
            <Content>
                <Card>
                    <Form>
                        <Item inlineLabel>
                            <Label style={styles.labelText}>First Name *</Label>
                            <Input style={styles.inputText} 
                                    onChangeText={ handleFirstName.bind(this) }
                                    value={this.props.firstName }
                                    autoCorrect={false} 
                                    returnKeyType="next"
                                    onSubmitEditing={() => this.lastNameInput._root.focus()}/>
                        </Item>
                        <Item inlineLabel>
                            <Label style={styles.labelText}>Last Name *</Label>
                            <Input style={styles.inputText} 
                                    onChangeText={ handleLastName.bind(this) } 
                                    value={this.props.lastName }
                                    autoCorrect={false} 
                                    ref={(input) => this.lastNameInput = input}
                                    returnKeyType="next"
                                    onSubmitEditing={() => this.mobileNumberInput._root.focus()} />
                        </Item>
                        <Item inlineLabel>
                            <Label style={styles.labelText}>Mobile +63 *</Label>
                            <Input style={styles.inputText} 
                                    placeholder={"(9081234567)"} 
                                    maxLength={10}
                                    keyboardType = 'numeric'
                                    onChangeText={ handleMobileNumber.bind(this) }
                                    value={this.props.mobileNumber } 
                                    ref={(input) => this.mobileNumberInput = input}
                                    returnKeyType="next"
                                    onSubmitEditing={() => this.emailInput._root.focus()} />
                        </Item>
                        <Item inlineLabel>
                            <Label style={styles.labelText}>Email *</Label>
                            <Input style={styles.inputText} 
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onChangeText={ handleEmail.bind(this) }
                                    value={this.props.email } 
                                    ref={(input) => this.emailInput = input} 
                                    returnKeyType="next"
                                    onSubmitEditing={() => this.passwordInput._root.focus()} />
                        </Item>
                        <Item inlineLabel last>
                            <Label style={styles.labelText}>Password *</Label>
                            <Input style={styles.inputText} 
                                    onChangeText={ handlePassword.bind(this) }
                                    value={this.props.password } 
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    returnKeyType="go"
                                    secureTextEntry 
                                    ref={(input) => this.passwordInput = input} />
                        </Item>
                        <Button style={{backgroundColor:"#E90000"}} disabled={this.props.loadingStatus} onPress={() => this.props.addAccount()} full success>
                            <Text style={styles.buttonText}><Icon name="paper-plane" size={15} color="#FFF" />  SUBMIT</Text>
                            { (this.props.loadingStatus == true) &&
                                <Spinner color='white' />
                            }
                        </Button>
                    </Form>
                </Card>
            </Content>
        </Container>
        );
    }
}

const styles = StyleSheet.create({
    menu: {
		color: "#fff",
		fontSize: 20
    },
    headerText:{
		color:"#fff",
        fontSize:18,
        fontWeight: "bold"
    },
    labelText: {
        fontSize: 13,
        fontWeight: "bold",
        color: "#808080"
    },
    buttonText: {
        fontWeight: "bold",
        fontSize: 15
    },
    inputText: {
        fontSize: 14
    }
});