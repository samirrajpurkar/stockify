import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import * as firebase from 'firebase';

const Links = () => (
  <nav className="nav">
    <Link className="nav-link" to="/">Home</Link>
    <Link className="nav-link" to="/about">About</Link>
    <Link className="nav-link" to="/form">Form</Link>
    <Link className="nav-link" to="/contact">Contact</Link>
    <Link className="nav-link" to="/private">Private</Link>
    <Link className="nav-link" to="/login">Login</Link>
  </nav>
);

class Login extends Component {
  
  static isPrivate = false;

  render() {
    return (
      <h1>Login</h1>
    );
  }
}

class TodoList extends Component {
  render() {
    var _this = this;
    var createItem = function(item, index) {
      return (
        <li key={ index }>
          { item.text }
          <span onClick={ _this.props.removeItem.bind(null, item['.key']) }
                style={{ color: 'red', marginLeft: '10px', cursor: 'pointer' }}>
            X
          </span>
        </li>
      );
    };
    return <ul>{ this.props.items.map(createItem) }</ul>;
  }
}

class TodoForm extends Component {
  constructor() {
    super();
    this.state = {
      reDirect: false 
    }
  }

  submitForm = (e) => {
    e.preventDefault();
    this.setState({reDirect: true});
    this.props.handleSubmit(e);
  }

  render() {
    const { reDirect } = this.state;

    return (
    <div>
    <form onSubmit={ this.submitForm }>
        <input onChange={ this.props.handleChange } value={ this.props.text } />
        <button>{ 'Add #' + (this.props.items.length + 1) }</button>
    </form>
    {reDirect && (<Redirect to={'/'}/>)}
    </div>
  );
}
}

class Private extends Component {
  static isPrivate = true;
  render() {
    return (
      <h1>Private</h1>
    );
  }
}
// Mock authentication
const isAuthenticated = () => false;

const AuthRoute = ({
  component,
  ...props
}) => {
  const {isPrivate} = component;

  if (isAuthenticated() === false) {
    if (isPrivate === true) {
      return <Redirect to={'/login'} />
    }
    if (isPrivate === false) {
      return <Route {...props} component={component} />
    }
  }
}

class App extends Component {
    constructor() {
    super();
    this.state = {
      items: [],
      text: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.firebaseRef = firebase.database().ref('items');
    this.firebaseRef.limitToLast(25).on('value', function(dataSnapshot) {
      var items = [];
      dataSnapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item['.key'] = childSnapshot.key;
        items.push(item);
      });

      this.setState({
        items: items
      });
    }.bind(this));
  }

  handleChange(event) {
       this.setState({text: event.target.value});
       console.log('Change');
      }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.text && this.state.text.trim().length !== 0) {
      this.firebaseRef.push({
        text: this.state.text
      });
      this.setState({
        text: ''
      });
    }
  }


  removeItem(key) {
    var firebaseRef = firebase.database().ref('items');
    firebaseRef.child(key).remove();
  }

  render() {
    return (
      <Router>
       <div>
         <Links />
         <Route exact path="/" render={() => <TodoList 
            items={this.state.items}
            removeItem={this.removeItem}
          />} />
         <Route path="/form" render={() => <TodoForm 
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            items={this.state.items}
            text={this.state.text}
          />} />
         <Route path="/about" render={() => <h1>About</h1>} />
         <Route path="/contact" render={() => <h1>Contact</h1>} />
         <AuthRoute component={Private} path="/private" />
         <AuthRoute component={Login} path="/login" />
       </div>
     </Router>
   );
  }
}

// const App = () => (
//   <Router>
//     <div>
//       <Links />
//       <Route exact path="/" render={() => <h1>Home</h1>} />
//       <Route path="/about" render={() => <h1>About</h1>} />
//       <Route path="/contact" render={() => <h1>Contact</h1>} />
//     </div>
//   </Router>
// );





// class App extends Component {
//   constructor() {
//     super();
//     this.state = {
//       items: [],
//       text: ''
//     }

//     this.handleChange = this.handleChange.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//   }

//   componentDidMount() {
//     this.firebaseRef = firebase.database().ref('items');
//     this.firebaseRef.limitToLast(25).on('value', function(dataSnapshot) {
//       var items = [];
//       dataSnapshot.forEach(function(childSnapshot) {
//         var item = childSnapshot.val();
//         item['.key'] = childSnapshot.key;
//         items.push(item);
//       });

//       this.setState({
//         items: items
//       });
//     }.bind(this));
//   }

//   removeItem(key) {
//     var firebaseRef = firebase.database().ref('items');
//     firebaseRef.child(key).remove();
//   }

//   handleChange(event) {
//       this.setState({text: event.target.value});
//     }

//   handleSubmit(event) {
//     event.preventDefault();
//     if (this.state.text && this.state.text.trim().length !== 0) {
//       this.firebaseRef.push({
//         text: this.state.text
//       });
//       this.setState({
//         text: ''
//       });
//     }
//     console.log(this.state.items);
//   }

//   render() {
//     return (
//           <div>
//             <TodoList items={ this.state.items } removeItem={ this.removeItem } />
//             <form onSubmit={ this.handleSubmit }>
//               <input onChange={ this.handleChange } value={ this.state.text } />
//               <button>{ 'Add #' + (this.state.items.length + 1) }</button>
//             </form>
//           </div>
//         );
//   }
// }

export default App;



