import React from 'react';
import { Link, browserHistory } from 'react-router';
import Breadcrumbs from './Breadcrumbs';
import { InputField, SelectField } from './FormFields';

class Register extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			formErrors: false,
			submitting: false
		}

		this.handleSubmit = this.handleSubmit.bind(this);
		this.signalFormSubmit = this.signalFormSubmit.bind(this);
		this.validateFields = this.validateFields.bind(this);
		this.goToError = this.goToError.bind(this);
	}
	componentDidUpdate(prevProps, prevState) {
		
		if (prevState.submitting && !this.state.submitting) {
			if (!this.state.formErrors) {
				browserHistory.push('/home');
			}
			else {
				console.log("errors!");
			}
		}
	}
	handleSubmit(e) {
		
		e.preventDefault();

		this.signalFormSubmit();
	}
	signalFormSubmit() {
		this.setState({ submitting: true });
	}
	validateFields() {
		
		let isValid = true;

		if ($('.invalid-field').length > 0) {
			isValid = false;
		}

		this.setState({ formErrors: isValid ? false : true, submitting: false });
	}
	goToError() {
		$('.invalid-field:eq(0)').focus();
	}
	render() {
		return (
			<section>
				<Breadcrumbs {...this.props} />

				<div className="container">
					<h1 className="my3">
						Register
						<small>Create an account and get started today.</small>
					</h1>

					{this.state.formErrors ? 
						<div className="notification error mb3">
							<strong>Oh snap!</strong> Looks like you need to adjust a few things. <a href="#" onClick={this.goToError}>Go to first error</a>
							<a href="#" className="right" onClick={(e)=>{e.preventDefault(); $('.notification').hide()}}>
								<i className="fa fa-times" aria-hidden="true"></i>
							</a>
						</div>
					: null }

					<div className="cols-wrapper flex">
						<div className="main-col flex">
							<div className="full-width">
								<form className="ts-form" onSubmit={this.handleSubmit}>
									<InputField formSubmitting={this.state.submitting} 
												validateFields={this.validateFields}
												fieldType='text'
												isRequired={true}
												maxLength = {100}
												uniqueName='forename'
												fieldText='Forename*'
												placeholderText='Forename' />

									<InputField formSubmitting={this.state.submitting} 
												validateFields={this.validateFields}
												fieldType='text'
												isRequired={true}
												maxLength = {100}
												uniqueName='surname'
												fieldText='Surname*'
												placeholderText='Surname' />

									<div className="cols-wrapper">
										<div className="side-col">
											<SelectField formSubmitting={this.state.submitting} 
														validateFields={this.validateFields}
														isRequired={true}
														uniqueName='sex'
														fieldText='Sex*'
														options={['Male', 'Female']}
														placeholderText='Please select' />
										</div>

										<div className="main-col">
											<InputField formSubmitting={this.state.submitting} 
														validateFields={this.validateFields}
														fieldType='text'
														isRequired={true}
														isDate={true}
														uniqueName='dob'
														fieldText='Date of birth*'
														placeholderText='Select dates' />
										</div>
									</div>

									<InputField formSubmitting={this.state.submitting} 
												validateFields={this.validateFields}
												fieldType='email'
												isRequired={true}
												uniqueName='email'
												fieldText='Email Address*'
												placeholderText='Email address' />

									<InputField formSubmitting={this.state.submitting} 
												validateFields={this.validateFields}
												fieldType='email'
												verifyField='email'
												isRequired={true}
												uniqueName='email_verify'
												fieldText='Verify Email Address*'
												placeholderText='Verify email address' />

									<InputField formSubmitting={this.state.submitting} 
												validateFields={this.validateFields}
												fieldType='password'
												isRequired={true}
												minLength={7}
												maxLength = {25}
												showPasswordTrigger = {true}
												uniqueName='password'
												fieldText='Password*'
												placeholderText='Password'
												subTextElement='Use between 7 - 25 characters. At least one uppercase character. At least one number.' />

									<div className="text-right">
										<input type="submit" className="ts-btn grey" value="Register" />
									</div>
								</form>
							</div>
						</div>

						<div className="side-col text-center flex">
							<div className="full-width valign-wrapper">
								<div className="valign margin-center">
									<h3>Already a member?</h3>
									<Link to="/login" className="ts-btn default">Login</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		)
	}
}

module.exports = Register;
