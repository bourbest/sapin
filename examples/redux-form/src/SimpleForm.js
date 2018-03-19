import React from "react";
import { Field, reduxForm } from "redux-form";
import { required, validate, createConfig, isEmail, minLength } from "sapin";
import { get } from "lodash";
import { connect } from "react-redux";

const config = createConfig({
  formatError: fieldError => {
    return `${fieldError.error}: params: ${JSON.stringify(fieldError.params)}`;
  }
});

const UserValidator = {
  firstName: [required, minLength(2)],
  lastName: [required, minLength(2)],
  email: [required, isEmail]
};

const validateUser = userFormValues => {
  return validate(userFormValues, UserValidator, config);
};

const CustumTextField = ({
  placeholder,
  input,
  label,
  disabled,
  required,
  meta: { touched, error, warning }
}) => {
  const textFieldProps = { ...input, disabled };
  const statusMessage = error || warning;
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 15 }}>
      <label style={{ marginRight: 10 }}>{label}:</label>
      <div>
        {touched &&
          statusMessage && (
            <div style={{ color: "#cc0000"}}>
              {statusMessage}
            </div>
          )}
        <input {...textFieldProps} />
      </div>
    </div>
  );
};

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
