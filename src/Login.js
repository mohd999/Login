import React, { Component, createContext } from 'react'
import './Login.css'

export default class Login extends Component {

    constructor(props){
    super(props);
    this.data=new Map();
    this.data.set('9813646722', '123456'); //Dummy data
    const storedNumber=localStorage.getItem("number"); //Get number from browser storage

    this.state={
      isLoggedIn:false,
      renderView:(storedNumber===null)?'':'LoggedIn',
      number:(storedNumber===null)?'':storedNumber,
      password:'',
      cPassword:''      
    };
  }
  handleCheckNumber=(e)=>{
    console.log("Number is: "+this.state.number);
    var pattern = new RegExp("[0-9]{10}");
    if(pattern.test(this.state.number)){
      //Check if number found 
      if(this.data.has(this.state.number)){
          console.log("Number found in DB");
          //Number found in database... Display Password authentication screen.
          this.setState({
            renderView:'loginPassword'
          });
      }else{
          console.log("Number not found in DB");
          //Number found in database... Display screen to save the password
          this.setState({
            renderView:'setPassword'
          });        
      }
    }
    e.preventDefault();
  }
  
  handleLogin=(e)=>{
    console.log("Login Button submit called");
    //Check password in data object
    if(this.data.get(this.state.number)===this.state.password){
        localStorage.setItem("number", this.state.number);
        this.setState({
            renderView:'LoggedIn'
        });
    }else{
        alert("Invalid Password");
    }
    e.preventDefault();
  }
  handleSavePassword=(e)=>{
    console.log("Save Password Button submit called");
    this.data.set(this.state.number, this.state.password)
    this.setState({
        renderView:'LoggedIn'
    });
    e.preventDefault();
  }
  logOut=()=>{
    localStorage.removeItem("number");
    console.log("Logout");
    this.setState({
        number:"",
        renderView:""
    });    
  }
  render(){
    switch (this.state.renderView) {
      case'loginPassword':  
        return (
          <div className="login">
            <h1>Login Screen</h1>
            <div className="msg success">Number {this.state.number} is registerd with us. Enter password to login.</div>  
            <form method="post">
                <input
                  key="loginPassword" 
                  type="password"
                  onChange = {(event,newValue) => this.setState({password:event.target.value})}
                  minLength="6" 
                  maxLength="10" 
                  placeholder="Enter password" 
                  autoFocus
                 />
                <button type="submit" onClick={this.handleLogin}>Login</button>
            </form>    
          </div>
        )
      case'setPassword':
         return (
          <div className="login">
            <h1>Register</h1>
         <div className="msg error">Opss..{this.state.number} is not registerd. Enter new password to get registerd.</div> 
            <form method="post">
                <div>
                    <input 
                    key="savePassword"
                    type="password"
                    onChange = {(event,newValue) => this.setState({password:event.target.value})}
                    minLength="6"
                    maxLength="10" 
                    placeholder="Enter new password" 
                    autoFocus 
                    />              
              </div>
              <div>
                <button type="submit" onClick={this.handleSavePassword}>Register & Login</button>
              </div>
            </form>    
          </div>
        )
      case'LoggedIn':
      return(
        <div className="login">
            <h1> Hello {this.state.number}</h1>
            <div>
                <button onClick={this.logOut}>LogOut</button>
            </div>
        </div>
      )  
      default:
        return (
          <div className="login">
            <h1>Login</h1>
            <div>Enter your phone number to login.</div> 
            <form method="post">
              <div>
                  <input 
                    key="loginInput"
                    type="tel" 
                    onChange = {(event,newValue) => {this.setState({number:event.target.value})}}
                    minLength="10"
                    maxLength="10"
                    placeholder="Enter Phone Number" 
                    pattern="[0-9]{10}"
                    autoFocus 
                />
              </div>
              <div>
                <button type="submit" onClick={this.handleCheckNumber}>Login</button>
              </div>
            </form>
            <div className="instructions">
                <h3>Dummy credentials:</h3>
                <ul>
                    <li>Phone Number: 9813646722</li>
                    <li>Password: 123456</li>
                </ul> 
            </div>    
          </div>
        )
    }
  }
}