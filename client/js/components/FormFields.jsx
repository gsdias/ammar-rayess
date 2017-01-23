import React from 'react';
import helpers from '../helpers/helperFunctions';

const errorMessagesArr = { required: 'This field is required',
							minLength: (value) => 'This field requires a minimum of ' + value + ' characters',
							maxLength: (value) => 'The entered number of characters exceed the maximum limit of ' + value + ' characters',
							date: 'Invalid date, format should be mm/dd/yyyy',
							email: 'Invalid email address',
							verify: (value) => 'The entered string should match the one in the ' + value + ' field'
						};

class FieldValidator extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			fieldIsValid: true,
			errorMessages: [],
			fieldValidated: false
		}

		this.handleInput = this.handleInput.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
		this.validateField = this.validateField.bind(this);
	}
	componentWillReceiveProps(nextProps) {

		if (nextProps.formSubmitting) {
			this.handleFormSubmit();
		}
	}
	componentDidUpdate(prevProps, prevState) {

		if (!prevState.fieldValidated && this.state.fieldValidated) {
			this.props.validateFields();

			this.setState({ fieldValidated: false });
		}
	}
}

class InputField extends FieldValidator {
	handleInput(e) {
		this.validateField(e.target.value);
	}
	handleFormSubmit() {
		let fieldValue = $('input[name=' + this.props.uniqueName + ']')[0].value;
		
		this.validateField(fieldValue);
	}
	validateField(fieldValue) {

		let isValid = true,
			errorMessages = [];

		if (this.props.isRequired) {
			if (fieldValue.trim() == '') {
				isValid = false;
				errorMessages.push(errorMessagesArr['required']);
			}
		}

		if (this.props.minLength && this.props.minLength > 0) {
			if (fieldValue.length < this.props.minLength) {
				isValid = false;
				errorMessages.push(errorMessagesArr['minLength'](this.props.minLength));
			}
		}

		if (this.props.maxLength) {
			if (fieldValue.length > this.props.maxLength) {
				isValid = false;
				errorMessages.push(errorMessagesArr['maxLength'](this.props.maxLength));
			}
		}

		if (this.props.isDate) {
			 if (!helpers.isValidDate(fieldValue)) {
			 	isValid = false;
				errorMessages.push(errorMessagesArr['date']);
			 }
		}

		if (this.props.fieldType == 'email') {
			if (!helpers.isValidEmail(fieldValue)) {
			 	isValid = false;
				errorMessages.push(errorMessagesArr['email']);
			 }
		}

		if (this.props.verifyField) {
			let targetFieldValue = $('input[name=' + this.props.verifyField + ']')[0].value;
			if (fieldValue != targetFieldValue) {
				isValid = false;
				errorMessages.push(errorMessagesArr['verify'](this.props.verifyField));
			}
		}

		this.setState({ fieldIsValid: isValid, errorMessages: errorMessages, fieldValidated: true });
	}
	togglePassword(e) {
		if (e.target.checked) {
			$('input[name=' + this.props.uniqueName + ']').attr('type', 'text');
		}
		else {
			$('input[name=' + this.props.uniqueName + ']').attr('type', 'password');
		}
	}
	render() {
		return (
			<div className={this.state.fieldIsValid ? 'input-group' : 'input-group error'}>
				<label htmlFor={this.props.uniqueName}>{this.props.fieldText}</label>

				<div className={`relative ${this.props.showPasswordTrigger ? 'field-extra' : null}`}>
					<input type={this.props.fieldType} name={this.props.uniqueName}  
										placeholder={this.props.placeholderText}  
										onBlur={this.handleInput}
										className={`${this.props.isDate ? 'date' : null } 
													${!this.state.fieldIsValid ? 'invalid-field' : null} 
													${this.props.showPasswordTrigger ? 'prime' : null}`} />

					{this.props.isDate ? 
						<span className="date-calendar"><i className=" fa fa-calendar"></i></span>
					:null }

					{this.props.showPasswordTrigger ? 
						<div className="sub text-center">
							<label>
								<input type="checkbox" name="show_password" onClick={this.togglePassword.bind(this)} />
								<span>Show</span>
							</label>
						</div>
					: null }
				</div>

				{!this.state.fieldIsValid ? 
					this.state.errorMessages.map((message, index) => (
						<small className="error-msg" key={index}>{message}</small>
					))
				: null }

				{this.props.subTextElement ? ( <small>{this.props.subTextElement}</small> ) : null}
			</div>
		)
	}
}

class SelectField extends FieldValidator {
	handleInput(e) {
		this.validateField(e.target.value);
	}
	handleFormSubmit() {
		let fieldValue = $('select[name=' + this.props.uniqueName + ']')[0].value;

		this.validateField(fieldValue);
	}
	validateField(fieldValue) {

		let isValid = true,
			errorMessages = [];

		if (this.props.isRequired) {
			if (fieldValue == '-') {
				isValid = false;
				errorMessages.push(errorMessagesArr['required']);
			}
		}

		this.setState({ fieldIsValid: isValid, errorMessages: errorMessages, fieldValidated: true });
	}
	render() {
		return (
			<div className={this.state.fieldIsValid ? 'input-group' : 'input-group error'}>
				<label htmlFor={this.props.uniqueName}>{this.props.fieldText}</label>

				<div className="relative">
					<select name={this.props.uniqueName} 
							onChange={this.handleInput} 
							onBlur={this.handleInput}
							className={!this.state.fieldIsValid ? 'invalid-field' : null}>
						<option value="-">{this.props.placeholderText}</option>
						{this.props.options.map((option, index) => (
							<option key={index} value={option}>{option}</option>
						))}
					</select>
				</div>

				{!this.state.fieldIsValid ? 
					this.state.errorMessages.map((message, index) => (
						<small className="error-msg" key={index}>{message}</small>
					))
				: null }

				{this.props.subTextElement ? ( <small>{this.props.subTextElement}</small> ) : null}
			</div>
		)
	}
}

module.exports = { InputField, SelectField };
