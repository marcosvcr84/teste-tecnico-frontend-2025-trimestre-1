
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ user: '', display: '', cep: '' });
  const [filters, setFilters] = useState({ user: '', city: '', state: '', display: '' });
  useEffect(() => { const saved = JSON.parse(localStorage.getItem('contacts')) || []; setContacts(saved); }, []);
  const handleAdd = async () => {
    try {
      const { data } = await axios.get(`https://viacep.com.br/ws/${form.cep}/json/`);
      const newContact = { ...form, city: data.localidade, state: data.uf };
      const updated = [...contacts, newContact];
      setContacts(updated);
      localStorage.setItem('contacts', JSON.stringify(updated));
      toast.success('Contato adicionado');
    } catch { toast.error('Erro ao buscar endereço'); }
  };
  const handleDelete = (i) => { const updated = contacts.filter((_, idx) => idx !== i); setContacts(updated); localStorage.setItem('contacts', JSON.stringify(updated)); };
  const filtered = contacts.filter(c => c.user.includes(filters.user) && c.city.includes(filters.city) && c.state.includes(filters.state) && c.display.includes(filters.display));
  return (<div><h1>Agenda</h1>
    <input placeholder='Usuário' onChange={e => setForm({...form, user: e.target.value})}/>
    <input placeholder='Nome de exibição' onChange={e => setForm({...form, display: e.target.value})}/>
    <input placeholder='CEP' onChange={e => setForm({...form, cep: e.target.value})}/>
    <button onClick={handleAdd}>Adicionar</button>
    <input placeholder='Filtrar usuário' onChange={e => setFilters({...filters, user: e.target.value})}/>
    {filtered.map((c, i) => (<div key={i}>
      <b>{c.display}</b> - {c.city}/{c.state} - <button onClick={() => handleDelete(i)}>Excluir</button>
    </div>))}
    <ToastContainer />
  </div>);
}
export default App;
