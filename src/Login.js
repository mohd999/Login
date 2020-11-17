import React, { Component } from 'react'
import './Login.css'

export default class Login extends Component {

    constructor(props){
    super(props);

    this.data=new Map();
    //Dummy data
    this.data.set('9813646722', '123456'); 
    //Get number from browser storage
    const storedNumber=localStorage.getItem("number"); 
    //Set State   
    this.state={
      isLoggedIn:false,
      renderView:(storedNumber===null)?'':'LoggedIn',
    };
  }
  handleCheckNumber=(e)=>{
    console.log("Number is: "+this.number);
    var pattern = new RegExp("[0-9]{10}");
    if(pattern.test(this.number)){
      //Check if number found 
      /*Post API to Check the number the passowrd
        curl -X POST \
        /api/account/CheckNumber \
        -H 'api_key: xyz' \
        -H 'auth: Mzg2NixnblQ2ZnZMTEhiZDNzeDdacGxxczY1OA' \
        -H 'cache-control: no-cache' \
        -d 'number=this.number'
      */
      if(this.data.has(this.number)){
          console.log("Number found in DB");
          //Number found in database... Display Password authentication screen.
          this.setState({
            renderView:'authPassword'
          });
      }else{
          console.log("Number not found in DB");
          //Number not found in database... Create new account
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
    /*Post API to validate login with numbner and password
      curl -X POST \
      /api/account/login \
      -H 'api_key: xyz' \
      -H 'auth: Mzg2NixnblQ2ZnZMTEhiZDNzeDdacGxxczY1OA' \
      -H 'cache-control: no-cache' \
      -d 'number=this.number&password=this.password'
    */
    if(this.data.get(this.number)===this.password){
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
    /*Post API to create new account
    curl -X POST \
      /api/account/create \
      -H 'api_key: xyz' \
      -H 'auth: Mzg2NixnblQ2ZnZMTEhiZDNzeDdacGxxczY1OA' \
      -H 'cache-control: no-cache' \
      -d 'number=this.number&password=this.number'
    */
    this.data.set(this.number, this.password)
    this.setState({
        renderView:'LoggedIn'
    });
    //Login user after creating the account. redirect user to logged in screen
    e.preventDefault();
  }
  logOut=()=>{
    localStorage.removeItem("number");
    console.log("Logout");
    /*Post API to Logout
    
    */
    this.setState({
        number:"",
        renderView:""
    });    
  }
  render(){
    switch (this.state.renderView) {
      case'authPassword':  
        return (
          <div className="login">
            <h1>Login Screen</h1>
            <div className="msg success">Number {this.number} is registerd with us. Enter password to login.</div>  
            <form method="post">
                <input
                  key="loginPassword" 
                  type="password"
                  onChange = {(event,newValue) => this.password=event.target.value}
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
         <div className="msg error">Opss..{this.number} is not registerd. Enter new password to get registerd.</div> 
            <form method="post">
                <div>
                    <input 
                    key="savePassword"
                    type="password"
                    onChange = {(event,newValue) => this.password=event.target.value}
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
            <h1> Hello {this.number}</h1>
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
                    onChange = {(event,newValue) => this.number=event.target.value}
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