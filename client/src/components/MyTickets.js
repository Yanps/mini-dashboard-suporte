import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  Divider,
  Paper,
  InputAdornment,
  Collapse,
  IconButton
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Search as SearchIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  History as HistoryIcon
} from '@material-ui/icons';
import clsx from 'clsx';
import ticketService from '../services/ticketService';
import websocketService from '../services/websocketService';
import { StatusLabels, PriorityLabels } from '../types/ticket';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    margin: theme.spacing(2),
  },
  searchSection: {
    marginBottom: theme.spacing(3),
  },
  ticketCard: {
    marginBottom: theme.spacing(2),
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4],
    },
  },
  ticketHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(1),
  },
  ticketTitle: {
    fontWeight: 600,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(0.5),
  },
  ticketMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
    marginBottom: theme.spacing(1),
  },
  chipContainer: {
    display: 'flex',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  statusChip: {
    fontWeight: 600,
  },
  priorityChip: {
    fontWeight: 600,
  },
  description: {
    backgroundColor: '#f9f9f9',
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(1),
    whiteSpace: 'pre-wrap',
    lineHeight: 1.5,
  },
  historySection: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: '#f5f5f5',
    borderRadius: theme.shape.borderRadius,
  },
  historyItem: {
    padding: theme.spacing(1),
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(1),
    backgroundColor: 'white',
    borderRadius: theme.shape.borderRadius,
    '&:last-child': {
      marginBottom: 0,
    },
  },
  emptyState: {
    textAlign: 'center',
    padding: theme.spacing(4),
    color: theme.palette.text.secondary,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(4),
  },
}));

function MyTickets({ userEmail, onEmailChange }) {
  const classes = useStyles();
  const [email, setEmail] = useState(userEmail || '');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedTickets, setExpandedTickets] = useState(new Set());

  useEffect(() => {
    if (userEmail) {
      setEmail(userEmail);
      handleSearch(userEmail);
    }
  }, [userEmail]);

  useEffect(() => {
    // Setup WebSocket listeners for real-time updates
    const unsubscribeCreated = websocketService.on('ticketCreated', (ticket) => {
      if (ticket.requesterEmail === email) {
        setTickets(prev => [ticket, ...prev]);
      }
    });

    const unsubscribeUpdated = websocketService.on('ticketUpdated', (updatedTicket) => {
      if (updatedTicket.requesterEmail === email) {
        setTickets(prev => 
          prev.map(ticket => 
            ticket._id === updatedTicket._id ? updatedTicket : ticket
          )
        );
      }
    });

    const unsubscribeDeleted = websocketService.on('ticketDeleted', (data) => {
      setTickets(prev => prev.filter(ticket => ticket._id !== data.id));
    });

    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
      unsubscribeDeleted();
    };
  }, [email]);

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    onEmailChange(newEmail);
  };

  const handleSearch = async (searchEmail = email) => {
    if (!searchEmail.trim()) {
      setError('Por favor, informe um email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const ticketsData = await ticketService.getTicketsByEmail(searchEmail.trim());
      setTickets(ticketsData);
    } catch (err) {
      setError(err.message || 'Erro ao buscar tickets');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleTicketExpansion = (ticketId) => {
    setExpandedTickets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ticketId)) {
        newSet.delete(ticketId);
      } else {
        newSet.add(ticketId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getStatusColor = (status) => {
    const colors = {
      'open': 'primary',
      'in_progress': 'secondary',
      'resolved': 'default',
      'closed': 'default'
    };
    return colors[status] || 'default';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': 'default',
      'medium': 'primary',
      'high': 'secondary',
      'urgent': 'secondary'
    };
    return colors[priority] || 'default';
  };

  const getHistoryActionLabel = (action) => {
    const labels = {
      'created': 'Criado',
      'status_changed': 'Status alterado',
      'priority_changed': 'Prioridade alterada',
      'assigned': 'Responsável atribuído'
    };
    return labels[action] || action;
  };

  return (
    <Paper className={classes.paper}>
      <Typography variant="h5" style={{ marginBottom: 24, color: '#1976d2' }}>
        Meus Tickets
      </Typography>

      <div className={classes.searchSection}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={handleEmailChange}
              onKeyPress={handleKeyPress}
              placeholder="Digite seu email para consultar tickets"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={() => handleSearch()}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
            >
              {loading ? 'Buscando...' : 'Buscar Tickets'}
            </Button>
          </Grid>
        </Grid>
      </div>

      {error && (
        <Alert severity="error" style={{ marginBottom: 16 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      )}

      {!loading && tickets.length === 0 && email && (
        <div className={classes.emptyState}>
          <Typography variant="h6" gutterBottom>
            Nenhum ticket encontrado
          </Typography>
          <Typography variant="body2">
            Não foram encontrados tickets para o email "{email}".
          </Typography>
        </div>
      )}

      {!loading && tickets.length > 0 && (
        <div>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} encontrado{tickets.length !== 1 ? 's' : ''}
            </Typography>
            <Button
              startIcon={<RefreshIcon />}
              onClick={() => handleSearch()}
              disabled={loading}
            >
              Atualizar
            </Button>
          </Box>

          {tickets.map((ticket) => {
            const isExpanded = expandedTickets.has(ticket._id);
            
            return (
              <Card key={ticket._id} className={classes.ticketCard}>
                <CardContent>
                  <div className={classes.ticketHeader}>
                    <div style={{ flex: 1 }}>
                      <Typography variant="h6" className={classes.ticketTitle}>
                        {ticket.title}
                      </Typography>
                      
                      <div className={classes.ticketMeta}>
                        <CalendarIcon fontSize="small" />
                        <span>Criado em {formatDate(ticket.createdAt)}</span>
                        {ticket.updatedAt && ticket.updatedAt !== ticket.createdAt && (
                          <>
                            <span>•</span>
                            <span>Atualizado em {formatDate(ticket.updatedAt)}</span>
                          </>
                        )}
                      </div>

                      <div className={classes.chipContainer}>
                        <Chip
                          label={StatusLabels[ticket.status] || ticket.status}
                          color={getStatusColor(ticket.status)}
                          className={classes.statusChip}
                          size="small"
                        />
                        <Chip
                          label={PriorityLabels[ticket.priority] || ticket.priority}
                          color={getPriorityColor(ticket.priority)}
                          className={classes.priorityChip}
                          size="small"
                          variant="outlined"
                        />
                        {ticket.assignedTo && (
                          <Chip
                            label={`Responsável: ${ticket.assignedTo}`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <Collapse in={isExpanded}>
                    <div className={classes.description}>
                      {ticket.description}
                    </div>

                    {ticket.history && ticket.history.length > 0 && (
                      <div className={classes.historySection}>
                        <Typography variant="subtitle2" gutterBottom>
                          <HistoryIcon fontSize="small" style={{ marginRight: 8, verticalAlign: 'middle' }} />
                          Histórico
                        </Typography>
                        {ticket.history.map((entry, index) => (
                          <div key={index} className={classes.historyItem}>
                            <Typography variant="body2" style={{ fontWeight: 600 }}>
                              {getHistoryActionLabel(entry.action)}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {formatDate(entry.timestamp)}
                              {entry.changedBy && ` por ${entry.changedBy}`}
                            </Typography>
                            {entry.oldValue && entry.newValue && (
                              <Typography variant="caption" display="block">
                                {entry.oldValue} → {entry.newValue}
                              </Typography>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </Collapse>
                </CardContent>
                
                <CardActions>
                  <Button
                    onClick={() => toggleTicketExpansion(ticket._id)}
                    startIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  >
                    {isExpanded ? 'Menos detalhes' : 'Mais detalhes'}
                  </Button>
                </CardActions>
              </Card>
            );
          })}
        </div>
      )}
    </Paper>
  );
}

export default MyTickets;

