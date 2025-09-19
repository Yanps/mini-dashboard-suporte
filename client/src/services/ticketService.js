import api from './api';

class TicketService {
  async createTicket(ticketData) {
    try {
      const response = await api.post('/tickets', ticketData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar ticket');
    }
  }

  async getTicketsByEmail(email) {
    try {
      const response = await api.get(`/tickets/by-email/${email}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar tickets');
    }
  }

  async getTicket(id) {
    try {
      const response = await api.get(`/tickets/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar ticket');
    }
  }

  async getAllTickets(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await api.get(`/tickets?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar tickets');
    }
  }
}

export default new TicketService();

