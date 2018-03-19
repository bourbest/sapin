This is an example of `sapin usage with redux-form` bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## CustomTextField

```javascript
const CustumTextField = ({
  placeholder,
  input,
  label,
  disabled,
  required,
  meta: { touched, error }
}) => {
  const textFieldProps = { ...input, disabled };
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 15 }}>
      <label style={{ marginRight: 10 }}>{label}:</label>
      <div>
        {touched &&
          statusMessage && (
            <div style={{ color: "#cc0000"}}>
              {error}
            </div>
          )}
        <input {...textFieldProps} />
      </div>
    </div>
  );
};

```
The main objective is to display the field errors and use it frequently as needed.

## form validation config

```javascript
const config = createConfig({
  formatError: fieldError => {
    return `${fieldError.error}: params: ${JSON.stringify(fieldError.params)}`;
  }
});
```
We provide a configuration to our validation configuration so that we will format our error messages to be displayed.Here we are just showing the error `key/message` and the related parameters.

This formatting function is used for the error each each validated field.

## Simple user form

```javascript


class SimpleForm extends React.Component {
  render() {
    const { handleSubmit, pristine, reset, submitting, formErrors } = this.props;
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <Field
            name="firstName"
            component={CustumTextField}
            type="text"
            placeholder="First Name"
            label="First Name"
          />
          <Field
            name="lastName"
            component={CustumTextField}
            type="text"
            placeholder="Last Name"
            label="Last Name"
          />
          <Field
            name="email"
            component={CustumTextField}
            type="text"
            placeholder="Email"
            label="Email"
          />
          <div>
            <button type="submit" disabled={pristine || submitting}>
              Submit
            </button>
            <button
              type="button"
              disabled={pristine || submitting}
              onClick={reset}
            >
              Clear Values
            </button>
          </div>
        </form>
        {formErrors && <div style={{ marginTop: 20 }}>{JSON.stringify(formErrors)}</div>}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { formErrors:  get(state, "form.simple.syncErrors", null)};
};

const Form = reduxForm({
  form: "simple",
  validate: validateUser
})(SimpleForm);

const ConnectedForm = connect(mapStateToProps)(Form);

export default ConnectedForm;


```

```javascript
const mapStateToProps = state => {
  return { formErrors:  get(state, "form.simple.syncErrors", null)};
};
```
This is just to retrieve all the errors of the form

```javascript
const Form = reduxForm({
  form: "simple",
  validate: validateUser
})(SimpleForm);
```
`validateUser` is the main validation function of the whole form as:

```javascript

const validateUser = userFormValues => {
  return validate(userFormValues, UserValidator, config);
};
```
This function uses the validator object defined as follow:
```javascript
const UserValidator = {
  firstName: [required, minLength(2)],
  lastName: [required, minLength(2)],
  email: [required, isEmail]
};
```

Note the array of validator for each field of the form and how we used the functions:
```javascript
required: validator
isEmail: validator
minLength: (size: Integer) => validator: Function
```
`minLength` is a decorator function that returns a validation function