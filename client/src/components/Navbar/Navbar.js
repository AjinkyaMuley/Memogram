import React, { useState, useEffect } from 'react';
import { AppBar, Avatar, Button, Toolbar, Typography } from '@material-ui/core';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import {jwtDecode} from 'jwt-decode'
import memoriesLogo from '../../images/memories-Logo.png'
import memoriesText from '../../images/memories-Text.png'
import useStyles from './styles'

const Navbar = () => {

    const classes = useStyles();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    console.log(user)

    const logout = () => {
        dispatch({ type: 'LOGOUT' });

        navigate('/');
        setUser(null);
    }

    useEffect(() => {
        const token = user?.token;
        // console.log(token)

        if(token){
            const decodedToken = jwtDecode(token);

            if(decodedToken.exp*1000 < new Date().getTime()){
                logout();
            }
        }

        setUser(JSON.parse(localStorage.getItem('profile')))
    }, [location])

    return (
        <AppBar className={classes.appBar} position="static" color="inherit">
            <div className={classes.brandContainer}>
                <Typography component={Link} to="/" className={classes.heading} variant='h2' align='center'>MemoGram</Typography>
                <img className={classes.image} src={memoriesLogo} alt='memories' height="40px" />
            </div>
            <Toolbar className={classes.toolbar}>
                {user && user.result ? (
                    <div className={classes.profile}>
                        <Avatar className={classes.purple} alt={user.result.name} src={user.result.imageUrl}>{user.result.name.charAt(0)}</Avatar>
                        <Typography className={classes.userName} variant='h6'>{user.result.name}</Typography>
                        <Button variant='contained' className={classes.logout} color='secondary' onClick={logout}>Logout</Button>
                    </div>
                ) : (
                    <Button component={Link} to="/auth" variant='contained' color='primary'>Sign In</Button>
                )}
            </Toolbar>
        </AppBar>
    )
}

export default Navbar
