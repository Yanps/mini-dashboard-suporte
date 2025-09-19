import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  CircularProgress,
  Grid,
  Paper
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { Send as SendIcon } from '@material-ui/icons';
import ticketService from '../services/ticketService';
import { TicketPriority, PriorityLabels } from '../types/ticket';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    margin: theme.spacing(2),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  submitButton: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5),
  },
  title: {
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
  },
}));

function CreateTicketForm({ onTicketCreated, onEmailChange, defaultEmail }) {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: TicketPriority.MEDIUM,
    requesterEmail: defaultEmail || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Update email in parent component
    if (field === 'requesterEmail') {
      onEmailChange(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.requesterEmail.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await ticketService.createTicket(formData);
      setSuccess('Ticket criado com sucesso!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: TicketPriority.MEDIUM,
        requesterEmail: formData.requesterEmail // Keep email
      });

      // Notify parent
      setTimeout(() => {
        onTicketCreated();
        setSuccess('');
      }, 2000);

    } catch (err) {
      setError(err.message || 'Erro ao criar ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper className={classes.paper}>
      <Typography variant="h5" className={classes.title}>
        Criar Novo Ticket
      </Typography>
      
      {error && (
        <Alert severity="error" style={{ marginBottom: 16 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" style={{ marginBottom: 16 }}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className={classes.form}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Título do Ticket"
              variant="outlined"
              value={formData.title}
              onChange={handleChange('title')}
              required
              disabled={loading}
              placeholder="Descreva brevemente o problema"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined" required>
              <InputLabel>Prioridade</InputLabel>
              <Select
                value={formData.priority}
                onChange={handleChange('priority')}
                label="Prioridade"
                disabled={loading}
              >
                {Object.entries(PriorityLabels).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              value={formData.requesterEmail}
              onChange={handleChange('requesterEmail')}
              required
              disabled={loading}
              placeholder="seu@email.com"
              helperText="Este email será usado para consultar seus tickets"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descrição"
              multiline
              minRows={6}
              variant="outlined"
              value={formData.description}
              onChange={handleChange('description')}
              required
              disabled={loading}
              placeholder="Descreva detalhadamente o problema, incluindo passos para reproduzi-lo, mensagens de erro, etc."
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
          className={classes.submitButton}
        >
          {loading ? 'Criando Ticket...' : 'Criar Ticket'}
        </Button>
      </form>
    </Paper>
  );
}

export default CreateTicketForm;

