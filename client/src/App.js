import React, { useState, useEffect } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
  Paper
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CreateTicketForm from './components/CreateTicketForm';
import MyTickets from './components/MyTickets';
import websocketService from './services/websocketService';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    marginBottom: theme.spacing(3),
  },
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  tabContent: {
    paddingTop: theme.spacing(3),
  },
}));

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function App() {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');

  useEffect(() => {
    // Connect to WebSocket
    websocketService.connect();

    return () => {
      websocketService.disconnect();
    };
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEmailChange = (email) => {
    setUserEmail(email);
    localStorage.setItem('userEmail', email);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.root}>
            Mini Dashboard Suporte - Cliente
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" className={classes.container}>
        <Paper elevation={2}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Criar Ticket" />
            <Tab label="Meus Tickets" />
          </Tabs>

          <div className={classes.tabContent}>
            <TabPanel value={tabValue} index={0}>
              <CreateTicketForm 
                onTicketCreated={() => setTabValue(1)}
                onEmailChange={handleEmailChange}
                defaultEmail={userEmail}
              />
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <MyTickets 
                userEmail={userEmail}
                onEmailChange={handleEmailChange}
              />
            </TabPanel>
          </div>
        </Paper>
      </Container>
    </div>
  );
}

export default App;

