import React from 'react';
import { AppBar, Toolbar, makeStyles } from '@material-ui/core';
import logo from './images/dereit-logo.PNG';

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));


const NavBar = () => {
    const classes = useStyles();

    return(
        <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
          <a href="/deReit"><img src= { logo } alt="logo" className={classes.logo}></img></a>         

    </Toolbar>
        </AppBar>
      </div>
    )
}

export default NavBar;