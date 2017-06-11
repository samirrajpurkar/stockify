import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import * as firebase from 'firebase';

const Links = () => (
  <nav className="nav">
    <Link className="nav-link" to="/">Home</Link>
    <Link className="nav-link" to="/about">About</Link>
    <Link className="nav-link" to="/contact">Contact</Link>
  </nav>
);

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

class App extends Component {
    constructor() {
    super();
    this.state = {
      items: [],
      text: ''
    }
    // this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
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
         <Route path="/about" render={() => <h1>About</h1>} />
         <Route path="/contact" render={() => <h1>Contact</h1>} />
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



