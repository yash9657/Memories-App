import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Paper, Grid, Typography, Container, TextField } from '@material-ui/core';
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import useStyles from './styles';
import Input from './Input';
import Icon from './icon';
import { signin, signup } from '../../actions/auth';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const Auth = () => {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const isSignUp = false;
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    function start() {
    gapi.client.init({
    clientId:"610869294708-eeq2g8s1k3ie4hki4tqmtpvojr596h59.apps.googleusercontent.com",
    scope: 'email',
      });
       }
      gapi.load('client:auth2', start);
       }, []);
   

  const handleSubmit = (e) => {
    e.preventDefault();
    if(isSignUp) {
      dispatch(signup(formData, navigate));
    } else {
      dispatch(signin(formData, navigate));
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  }

  const switchMode = () => {
    setIsSignUp((prevState) => !prevState);
    setShowPassword(false);
  }

  const googleSuccess = async (res) => {
    const result = res?.profileObj;
    const token = res?.tokenId;
    console.log(result?.name);

    try {
      dispatch({ type: 'AUTH', data: { result, token }});

      navigate('/');
    } catch (error) {
      console.log(error);
    }
  }

  const googleFailure = (error) => {
    console.log(error);
    console.log("Google Sign In was unsuccesful. Try again later")
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5">{isSignUp ? 'Sign Up' : 'Sign In'}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {
              isSignUp && (
                <>
                  <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                  <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                </>
              )
            }
            <Input name="email" label="Email" handleChange={handleChange} type="email" />
            <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
            {isSignUp && <Input name="confirmPassword" label="Confirm Password" handleChange={handleChange} type="password" />}
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
          <GoogleLogin 
            clientId="610869294708-eeq2g8s1k3ie4hki4tqmtpvojr596h59.apps.googleusercontent.com"
            render={(renderProps) => (
              <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">
                Google Sign In
              </Button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy="single_host_origin"
          />
          <Grid container justifyContent='flex-end'>
            <Grid item>
              <Button onClick={switchMode}>
                {isSignUp ? 'Already have an account ? Sign In' : "Don't have an account ? Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  )
}

export default Auth;