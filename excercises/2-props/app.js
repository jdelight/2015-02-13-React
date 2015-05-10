////////////////////////////////////////////////////////////////////////////////
// Excercise:
//
// http://facebook.github.io/react/docs/reusable-components.html#prop-validation
//
// - Don't access `USERS` directly in the app, use a prop
// - Validate Gravatar's `size` property, allow it to be a
//   a number, or a string that can be converted to a number,
//   ie: `size="asdf"` should warn (hint: parseInt)
// - in emailType, what if the prop name isn't email? what if we wanted
//   the prop to be "userEmail" or "loginId"? Switch the Gravatar
//   prop name from "email" to "loginId", send a bad value, and then
//   fix the code to make the warning make sense.
// - how many times does `getDefaultProps` get called?
// - experiment with some of the other propTypes, send improper values
//   and look at the messages you get
////////////////////////////////////////////////////////////////////////////////

var React = require('react');
var md5 = require('MD5');
var validateEmail = require('./validateEmail');
var warning = require('react/lib/warning');

var GRAVATAR_URL = "http://gravatar.com/avatar";

var USERS = [
  { id: 1, name: 'Ryan Florence', email: 'rpflorence@gmail.com' },
  { id: 2, name: 'Michael Jackson', email: 'mjijackson@gmail.com' }
];

var emailType = (props, propName, componentName) => {
  warning(
    validateEmail(props[propName]),
    `Invalid email '${props[propName]}' sent to '${componentName}'. Check the render method of '${componentName}'.`
  );
};

var validateNumber = (size) => !isNaN(parseInt(size, 10));

var numberOrNumberStringType = (props, propName, componentName) => {
  warning(
      validateNumber(props[propName]),
      `Invalid size '${props[propName]}' sent to ${componentName}`
  )
};

var Gravatar = React.createClass({
  propTypes: {
    loginId: emailType,
    size: numberOrNumberStringType
  },

  getDefaultProps () {
    return {
      size: 16
    };
  },

  render () {
    var { loginId, size } = this.props;
    var hash = md5(loginId);
    var url = `${GRAVATAR_URL}/${hash}?s=${size*2}`;
    return <img src={url} width={size} />;
  }
});

var App = React.createClass({
  render () {
    var users = this.props.users.map((user) => {
      return (
        <li key={user.id}>
          <Gravatar loginId={user.email} size={36} /> {user.name}
        </li>
      );
    });
    return (
      <div>
        <h1>Users</h1>
        <ul>{users}</ul>
      </div>
    );
  }
});

React.render(<App users={USERS} />, document.body);

require('./tests').run(Gravatar, emailType);

