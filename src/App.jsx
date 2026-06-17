import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, addDoc, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
import { Home, Users, ArrowLeftRight, Plus, Wallet, Landmark, Download, Trash } from 'lucide-react';

// All 164 members hardcoded — no seeding or database needed for members
const ALL_MEMBERS = [
  { id: "m001", group: "Rama", name: "Chllyyamma tamarana" },
  { id: "m002", group: "Rama", name: "Demudamma Tamarana" },
  { id: "m003", group: "Rama", name: "Demuduamma lalam" },
  { id: "m004", group: "Rama", name: "Demudamma paila" },
  { id: "m005", group: "Rama", name: "Ramanamma lalam" },
  { id: "m006", group: "Rama", name: "Lakshmi paila" },
  { id: "m007", group: "Rama", name: "Achiyyamma tamarana" },
  { id: "m008", group: "Rama", name: "Santhi pyla" },
  { id: "m009", group: "Rama", name: "Ramalaxmi Reddi" },
  { id: "m010", group: "Rama", name: "PylaBhavani Pyla" },
  { id: "m011", group: "Rama", name: "suneetha tamirana" },
  { id: "m012", group: "Sri Anjaneya", name: "Ammaji Pyla" },
  { id: "m013", group: "Sri Anjaneya", name: "Ashalatha Kotani" },
  { id: "m014", group: "Sri Anjaneya", name: "Kumari Bandaru" },
  { id: "m015", group: "Sri Anjaneya", name: "Manga Reddi" },
  { id: "m016", group: "Sri Anjaneya", name: "Neelamani Bailapudi" },
  { id: "m017", group: "Sri Anjaneya", name: "Sarojani Lalam" },
  { id: "m018", group: "Sri Anjaneya", name: "Venkatalakshmi Bandaru" },
  { id: "m019", group: "Sri Anjaneya", name: "Venkati Lalam" },
  { id: "m020", group: "Sri Anjaneya", name: "PylaPriyanka Pyla" },
  { id: "m021", group: "Sri Anjaneya", name: "PAILA HEMA PAILA" },
  { id: "m022", group: "SRI CHODAMAMBICA SHG", name: "Pyla Laksmi PYLA" },
  { id: "m023", group: "SRI CHODAMAMBICA SHG", name: "RONGALI JYOTHI RONGALI" },
  { id: "m024", group: "SRI CHODAMAMBICA SHG", name: "Kundrapu Devi KUNDRAPU" },
  { id: "m025", group: "SRI CHODAMAMBICA SHG", name: "PYLA LAXMI PYLA" },
  { id: "m026", group: "SRI CHODAMAMBICA SHG", name: "Paila Aruna Kumari PAILA" },
  { id: "m027", group: "SRI CHODAMAMBICA SHG", name: "PYLA SAROJINI PALA" },
  { id: "m028", group: "SRI CHODAMAMBICA SHG", name: "Kundrapu Ramadevi KUNDRAPU" },
  { id: "m029", group: "SRI CHODAMAMBICA SHG", name: "Kundrapu Ramadevi KUNDRAPU" },
  { id: "m030", group: "SRI CHODAMAMBICA SHG", name: "PYLA DEVI PYLA" },
  { id: "m031", group: "SRI DURGA DEVI SHG", name: "CHINTHALLI THAMARANA" },
  { id: "m032", group: "SRI DURGA DEVI SHG", name: "VIJAYA THAMARANA" },
  { id: "m033", group: "SRI DURGA DEVI SHG", name: "Reddi Ammaji REDDI" },
  { id: "m034", group: "SRI DURGA DEVI SHG", name: "Kotani Venkatasravani KOTANI" },
  { id: "m035", group: "SRI DURGA DEVI SHG", name: "RAMYA lalam" },
  { id: "m036", group: "SRI DURGA DEVI SHG", name: "VARALAXMI lalam" },
  { id: "m037", group: "SRI DURGA DEVI SHG", name: "VIJAYA pyla" },
  { id: "m038", group: "SRI DURGA DEVI SHG", name: "SANDHYA thamarana" },
  { id: "m039", group: "SRI DURGA DEVI SHG", name: "BADHRA KALI LAVANYA kondapalli" },
  { id: "m040", group: "SRI DURGA DEVI SHG", name: "Sirsha Reddi" },
  { id: "m041", group: "Sri Kanaka Durga", name: "Devudamma pyla" },
  { id: "m042", group: "Sri Kanaka Durga", name: "Devudamma pyla" },
  { id: "m043", group: "Sri Kanaka Durga", name: "Sanyasamma paila" },
  { id: "m044", group: "Sri Kanaka Durga", name: "Laxmi reddi" },
  { id: "m045", group: "Sri Kanaka Durga", name: "Simhachalam pyla" },
  { id: "m046", group: "Sri Kanaka Durga", name: "Krishnaveni pyla" },
  { id: "m047", group: "Sri Kanaka Durga", name: "PAILA CHANTI PAILA" },
  { id: "m048", group: "Sri Kanaka Durga", name: "RUTHALA LAKSHMI RUTHALA" },
  { id: "m049", group: "Sri Kanaka Durga", name: "RAMANAMMA kolli" },
  { id: "m050", group: "Sri Kanaka Durga", name: "NAGAMANI Dasari" },
  { id: "m051", group: "Krishna", name: "Lakshmi lalam" },
  { id: "m052", group: "Krishna", name: "Lakshmi palia" },
  { id: "m053", group: "Krishna", name: "Yerryyamma reddi" },
  { id: "m054", group: "Krishna", name: "Sanyasama tamarana" },
  { id: "m055", group: "Krishna", name: "Ramulamma bandaru" },
  { id: "m056", group: "Krishna", name: "Varalakshmi paila" },
  { id: "m057", group: "Krishna", name: "Savitri dasari" },
  { id: "m058", group: "Krishna", name: "Varalakshmi paila" },
  { id: "m059", group: "Krishna", name: "navya paila" },
  { id: "m060", group: "Krishna", name: "paila padmalatha paila" },
  { id: "m061", group: "PARIPALAMMA SHG", name: "DEMUDAMMA KUNDRAPU" },
  { id: "m062", group: "PARIPALAMMA SHG", name: "KRISHNAVENI PAILA" },
  { id: "m063", group: "PARIPALAMMA SHG", name: "KRISHNAVENI PAILA" },
  { id: "m064", group: "PARIPALAMMA SHG", name: "LAXMI RONGALI" },
  { id: "m065", group: "PARIPALAMMA SHG", name: "LAXMI PAILA" },
  { id: "m066", group: "PARIPALAMMA SHG", name: "PADMA PAILA" },
  { id: "m067", group: "PARIPALAMMA SHG", name: "SOMULAMMA PAILA" },
  { id: "m068", group: "PARIPALAMMA SHG", name: "SYAMALA RONGALI" },
  { id: "m069", group: "Sri Lakshmana", name: "Lakshmi ruttula" },
  { id: "m070", group: "Sri Lakshmana", name: "Parvathi lalam" },
  { id: "m071", group: "Sri Lakshmana", name: "Devi tamarana" },
  { id: "m072", group: "Sri Lakshmana", name: "Ramani tamarana" },
  { id: "m073", group: "Sri Lakshmana", name: "Pailaramoji paila" },
  { id: "m074", group: "Sri Lakshmana", name: "Kumari lalam" },
  { id: "m075", group: "Sri Lakshmana", name: "Chandramma tamarana" },
  { id: "m076", group: "Sri Lakshmana", name: "Krishnamma lalam" },
  { id: "m077", group: "Sri Lakshmana", name: "Kondamma paila" },
  { id: "m078", group: "Sri Lakshmana", name: "Sarmjini Reddi" },
  { id: "m079", group: "Sri Vinayaka", name: "Paiditalli reddy" },
  { id: "m080", group: "Sri Vinayaka", name: "Yerayyamma reddy" },
  { id: "m081", group: "Sri Vinayaka", name: "Gangamma lalam" },
  { id: "m082", group: "Sri Vinayaka", name: "Devudamma bandaru" },
  { id: "m083", group: "Sri Vinayaka", name: "Demudamma kundrapu" },
  { id: "m084", group: "Sri Vinayaka", name: "Bhavanani Pyla" },
  { id: "m085", group: "Sri Vinayaka", name: "Lalam Sunitha LALAM" },
  { id: "m086", group: "Sri Vinayaka", name: "SRUTHI ruttala" },
  { id: "m087", group: "Sri Vinayaka", name: "Ramalakshmi Puliga" },
  { id: "m088", group: "Sri Vinayaka", name: "ROSINI MASARAPU" },
  { id: "m089", group: "Sri Vinayaka", name: "KOTA DIVYA BHARATHI KOTA" },
  { id: "m090", group: "Sri Sita", name: "Laxmi paila" },
  { id: "m091", group: "Sri Sita", name: "Paiditalli paila" },
  { id: "m092", group: "Sri Sita", name: "Jayalakshmi paila" },
  { id: "m093", group: "Sri Sita", name: "Sathyavathi paila" },
  { id: "m094", group: "Sri Sita", name: "Kalyani paila" },
  { id: "m095", group: "Sri Sita", name: "Adilakshmi reddi" },
  { id: "m096", group: "Sri Sita", name: "Nookaratnam Lalam" },
  { id: "m097", group: "Sri Sita", name: "Demudamma paila" },
  { id: "m098", group: "Sri Sita", name: "saroja pyla" },
  { id: "m099", group: "Sri Sita", name: "rongaliasravani rongala" },
  { id: "m100", group: "Sri Sita", name: "Pushpa Reddi" },
  { id: "m101", group: "Sri Santhoshimatha", name: "Paiditalli tamarana" },
  { id: "m102", group: "Sri Santhoshimatha", name: "Sanyasamma tamarana" },
  { id: "m103", group: "Sri Santhoshimatha", name: "Kumari tamarana" },
  { id: "m104", group: "Sri Santhoshimatha", name: "Demudamma reddi" },
  { id: "m105", group: "Sri Santhoshimatha", name: "Ramanamma tamarana" },
  { id: "m106", group: "Sri Santhoshimatha", name: "Devudamma paila" },
  { id: "m107", group: "Sri Santhoshimatha", name: "Devi tamarana" },
  { id: "m108", group: "Sri Santhoshimatha", name: "Padma tamarana" },
  { id: "m109", group: "Sri Santhoshimatha", name: "Adigarlajyothi Adigarla" },
  { id: "m110", group: "Sri Santhoshimatha", name: "SAROJA kundrapu" },
  { id: "m111", group: "Sri Santhoshimatha", name: "SUDHARANI thamirana" },
  { id: "m112", group: "Sri Santhoshimatha", name: "varalakshmi Tamarana" },
  { id: "m113", group: "Sri Manikanta", name: "Varalakshmi bailapudi" },
  { id: "m114", group: "Sri Manikanta", name: "Chittamma Tamarana" },
  { id: "m115", group: "Sri Manikanta", name: "Reddy paila" },
  { id: "m116", group: "Sri Manikanta", name: "Varalakshmi kandregula" },
  { id: "m117", group: "Sri Manikanta", name: "Devi Rongala" },
  { id: "m118", group: "Sri Manikanta", name: "Ramani Adigarla" },
  { id: "m119", group: "Sri Manikanta", name: "Pyla Venkata Laxmi PYLA" },
  { id: "m120", group: "Sri Manikanta", name: "ARUNA rongala" },
  { id: "m121", group: "Sri Manikanta", name: "SATYAVATHI reddy" },
  { id: "m122", group: "Sri Manikanta", name: "chittamma tamarana" },
  { id: "m123", group: "SRI LAKSHMI SHG", name: "Annamreddy Suneetha annamreddy" },
  { id: "m124", group: "SRI LAKSHMI SHG", name: "MATHALA KUMARI mathala" },
  { id: "m125", group: "SRI LAKSHMI SHG", name: "Karri Devi karri" },
  { id: "m126", group: "SRI LAKSHMI SHG", name: "Gandi Rohini gandi" },
  { id: "m127", group: "SRI LAKSHMI SHG", name: "KOLLI VENKATALAKSHMI kolli" },
  { id: "m128", group: "SRI LAKSHMI SHG", name: "Saritha pyla" },
  { id: "m129", group: "SRI LAKSHMI SHG", name: "Yalla Neeraja yalla" },
  { id: "m130", group: "SRI LAKSHMI SHG", name: "Ramadavi Gelli" },
  { id: "m131", group: "SRI LAKSHMI SHG", name: "Manju Reddi" },
  { id: "m132", group: "SRI LAKSHMI SHG", name: "THARALA RAJESARI THAMARALA" },
  { id: "m133", group: "Paripillamma l", name: "Varahalamma lalam" },
  { id: "m134", group: "Paripillamma l", name: "Chinatalli reddi" },
  { id: "m135", group: "Paripillamma l", name: "Devudamma reddi" },
  { id: "m136", group: "Paripillamma l", name: "Lakshmi reddi" },
  { id: "m137", group: "Paripillamma l", name: "Muthyalama bandaru" },
  { id: "m138", group: "Paripillamma l", name: "Sanyasamma reddi" },
  { id: "m139", group: "Paripillamma l", name: "Ramulamma Reddi" },
  { id: "m140", group: "Paripillamma l", name: "Devudamma reddi" },
  { id: "m141", group: "Paripillamma l", name: "Devudamma reddy" },
  { id: "m142", group: "Paripillamma l", name: "Ramulamma reddy" },
  { id: "m143", group: "Paripillamma l", name: "RAMADEVI reddy" },
  { id: "m144", group: "Paripillamma l", name: "Satyavathi Boddu" },
  { id: "m145", group: "Paripillamma", name: "Chittamma tamarana" },
  { id: "m146", group: "Paripillamma", name: "Papa ruthula" },
  { id: "m147", group: "Paripillamma", name: "Papa reddy" },
  { id: "m148", group: "Paripillamma", name: "Somulamma reddy" },
  { id: "m149", group: "Paripillamma", name: "Arunasri A Parvathi Lalam" },
  { id: "m150", group: "Paripillamma", name: "Chinnammalu Paila" },
  { id: "m151", group: "Paripillamma", name: "Nagalakshmi Ruttala" },
  { id: "m152", group: "Paripillamma", name: "Nagamani Paila" },
  { id: "m153", group: "Paripillamma", name: "Tulasi Paila" },
  { id: "m154", group: "Paripillamma", name: "Naayanamma Narayanamma" },
  { id: "m155", group: "Maridimamba", name: "Venkata kundra" },
  { id: "m156", group: "Maridimamba", name: "Shivalakshmi kotana" },
  { id: "m157", group: "Maridimamba", name: "Ratnam sabbavarapu" },
  { id: "m158", group: "Maridimamba", name: "Satyavati paila" },
  { id: "m159", group: "Maridimamba", name: "Achiyamma paila" },
  { id: "m160", group: "Maridimamba", name: "Sanyasamma tamarana" },
  { id: "m161", group: "Maridimamba", name: "Lakshmi tamarana" },
  { id: "m162", group: "Maridimamba", name: "Ramathalli tamarana" },
  { id: "m163", group: "Maridimamba", name: "Nookalamma kundrapui" },
  { id: "m164", group: "Maridimamba", name: "Sireesha Lalam" }
];

const UNIQUE_GROUPS = [...new Set(ALL_MEMBERS.map(m => m.group))].sort();

const GROUPED_MEMBERS = ALL_MEMBERS.reduce((acc, m) => {
  if (!acc[m.group]) acc[m.group] = [];
  acc[m.group].push(m);
  return acc;
}, {});

export default function App() {
  const currentDate = new Date();
  const currentMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [membersTabGroupFilter, setMembersTabGroupFilter] = useState('');
  const [dbError, setDbError] = useState(false);
  const [methodDetailsModal, setMethodDetailsModal] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUnpaidOnly, setShowUnpaidOnly] = useState(false);

  useEffect(() => {
    try {
      const q = query(collection(db, 'transactions'), orderBy('date', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const txData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTransactions(txData);
        setDbError(false);
      }, (error) => {
        console.error("Firestore error:", error);
        setDbError(true);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Firestore setup error:", error);
      setDbError(true);
    }
  }, []);

  // Compute available months dynamically
  const availableMonths = [...new Set([
    currentMonthKey,
    ...transactions.map(tx => tx.date.substring(0, 7))
  ])].sort().reverse();
  
  const formatMonth = (yyyy_mm) => {
    const [y, m] = yyyy_mm.split('-');
    const d = new Date(y, parseInt(m) - 1);
    return d.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const currentMonthTransactions = transactions.filter(tx => tx.date.substring(0, 7) === selectedMonth);

  const totalCollected = currentMonthTransactions.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);
  const cashCollected = currentMonthTransactions.filter(t => t.method === 'cash').reduce((s, t) => s + parseFloat(t.amount || 0), 0);
  const momCollected = currentMonthTransactions.filter(t => t.method === 'mom').reduce((s, t) => s + parseFloat(t.amount || 0), 0);
  const dadCollected = currentMonthTransactions.filter(t => t.method === 'dad').reduce((s, t) => s + parseFloat(t.amount || 0), 0);

  const membersInSelectedGroup = ALL_MEMBERS.filter(m => m.group === selectedGroup);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const memberId = formData.get('memberId');
    const amount = parseFloat(formData.get('amount'));
    const method = formData.get('method');

    if (!memberId) {
      alert("Please select a member.");
      return;
    }
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      await addDoc(collection(db, 'transactions'), {
        memberId,
        amount,
        method,
        date: new Date().toISOString()
      });
      e.target.reset();
      setSelectedGroup('');
      alert("Payment saved successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Database error! Please check:\n1. Go to Firebase Console\n2. Open Firestore Database\n3. Go to Rules tab\n4. Set rules to allow read/write (see instructions below)");
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      try {
        await deleteDoc(doc(db, 'transactions', id));
      } catch (error) {
        console.error("Error deleting document: ", error);
        alert("Failed to delete. Check database rules.");
      }
    }
  };

  const handleExportCSV = () => {
    const headers = ["Date", "Group", "Member Name", "Amount (Rs)", "Payment Method"];
    const rows = currentMonthTransactions.map(tx => {
      const member = ALL_MEMBERS.find(m => m.id === tx.memberId);
      const date = new Date(tx.date).toLocaleDateString();
      const methodStr = tx.method === 'cash' ? 'Cash' : tx.method === 'mom' ? 'Mom Account' : 'Dad Account';
      return `"${date}","${member?.group || 'Unknown'}","${member?.name || 'Unknown'}","${tx.amount}","${methodStr}"`;
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dwcra-tracker-${formatMonth(selectedMonth).replace(' ', '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            DWCRA Tracker
          </h1>
          <div style={{ marginTop: '4px' }}>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '0.9rem' }}
            >
              {availableMonths.map(m => (
                <option key={m} value={m}>{formatMonth(m)}</option>
              ))}
            </select>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)} style={{ padding: '12px', borderRadius: '50%' }}>
          <Plus size={24} />
        </button>
      </header>

      {/* Database Error Banner */}
      {dbError && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          color: '#fca5a5'
        }}>
          <strong>⚠️ Database Not Connected!</strong>
          <p style={{ margin: '8px 0 0', fontSize: '0.85rem', lineHeight: '1.5' }}>
            Payments won't sync between devices. Fix this in Firebase Console:
            <br/>1. Go to <strong>Firestore Database → Rules</strong>
            <br/>2. Replace the rules with:
            <br/><code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>
              allow read, write: if true;
            </code>
            <br/>3. Click <strong>Publish</strong>
          </p>
        </div>
      )}

      {/* Main Content */}
      <main className="animate-fade-in">
        {activeTab === 'dashboard' && (
          <div>
            <div className="stats-grid">
              <div className="stat-card primary card" style={{ gridColumn: 'span 2' }}>
                <span className="stat-label">Total Collected ({formatMonth(selectedMonth)})</span>
                <h3>₹{totalCollected.toLocaleString()}</h3>
              </div>
              <div className="stat-card card">
                <span className="stat-label">Active Groups</span>
                <span className="stat-value">{UNIQUE_GROUPS.length}</span>
              </div>
              <div className="stat-card card">
                <span className="stat-label">Total Members</span>
                <span className="stat-value">{ALL_MEMBERS.length}</span>
              </div>
            </div>

            <h3 style={{ marginTop: '32px', marginBottom: '16px' }}>Collection Breakdown (Click for details)</h3>
            <div className="card" style={{ padding: '0' }}>
              <div className="list-item" onClick={() => setMethodDetailsModal('cash')} style={{ boxShadow: 'none', marginBottom: '0', borderBottom: '1px solid var(--surface-border)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: 'var(--success-bg)', padding: '10px', borderRadius: '12px', color: 'var(--success)' }}><Wallet size={20} /></div>
                  <span className="item-title">Cash on Hand</span>
                </div>
                <span className="item-amount amount-positive">₹{cashCollected.toLocaleString()}</span>
              </div>
              <div className="list-item" onClick={() => setMethodDetailsModal('mom')} style={{ boxShadow: 'none', marginBottom: '0', borderBottom: '1px solid var(--surface-border)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: 'var(--warning-bg)', padding: '10px', borderRadius: '12px', color: 'var(--warning)' }}><Landmark size={20} /></div>
                  <span className="item-title">Mom's Account</span>
                </div>
                <span className="item-amount amount-positive">₹{momCollected.toLocaleString()}</span>
              </div>
              <div className="list-item" onClick={() => setMethodDetailsModal('dad')} style={{ boxShadow: 'none', marginBottom: '0', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '10px', borderRadius: '12px', color: '#4f46e5' }}><Landmark size={20} /></div>
                  <span className="item-title">Dad's Account</span>
                </div>
                <span className="item-amount amount-positive">₹{dadCollected.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Members by Group</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{ALL_MEMBERS.length} members</span>
            </div>

            <div style={{ marginTop: '16px' }}>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <select
                  className="form-select"
                  value={membersTabGroupFilter}
                  onChange={(e) => setMembersTabGroupFilter(e.target.value)}
                >
                  <option value="">-- View All Groups --</option>
                  {UNIQUE_GROUPS.map(group => <option key={group} value={group}>{group}</option>)}
                </select>
                
                <input 
                  type="text" 
                  placeholder="🔍 Search member by name..." 
                  className="form-input" 
                  style={{ marginTop: '12px' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <input 
                    type="checkbox" 
                    checked={showUnpaidOnly}
                    onChange={(e) => setShowUnpaidOnly(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                  />
                  <span>Show Unpaid Members Only ({formatMonth(selectedMonth).split(' ')[0]})</span>
                </label>
              </div>

              {Object.keys(GROUPED_MEMBERS)
                .filter(groupName => membersTabGroupFilter === '' || groupName === membersTabGroupFilter)
                .sort()
                .map(groupName => {
                  const filteredMembers = GROUPED_MEMBERS[groupName].sort((a,b) => a.name.localeCompare(b.name)).filter(m => {
                    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
                    if (!matchesSearch) return false;
                    
                    if (showUnpaidOnly) {
                      const memberTxs = currentMonthTransactions.filter(t => t.memberId === m.id);
                      const memberTotalPaid = memberTxs.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);
                      return memberTotalPaid === 0;
                    }
                    
                    return true;
                  });

                  if (filteredMembers.length === 0) return null;

                  return (
                    <div key={groupName} style={{ marginBottom: '24px' }}>
                      <h4 style={{ color: 'var(--primary-shadow)', marginBottom: '8px', borderBottom: '2px solid rgba(99, 102, 241, 0.2)', paddingBottom: '4px' }}>
                        {groupName} ({filteredMembers.length})
                      </h4>
                      {filteredMembers.map(m => {
                        const memberTxs = currentMonthTransactions.filter(t => t.memberId === m.id);
                        const memberTotalPaid = memberTxs.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

                        return (
                          <div key={m.id} className="list-item">
                            <div className="item-main">
                              <span className="item-title">{m.name}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span className="item-subtitle">Paid in {formatMonth(selectedMonth).split(' ')[0]}</span>
                              <div className={`item-amount ${memberTotalPaid > 0 ? 'amount-positive' : ''}`} style={memberTotalPaid === 0 ? {color: '#ef4444'} : {}}>₹{memberTotalPaid.toLocaleString()}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
              })}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>History: {formatMonth(selectedMonth)}</h3>
              <button onClick={handleExportCSV} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Download size={16} /> Excel CSV
              </button>
            </div>
            
            <div style={{ marginTop: '16px' }}>
              {currentMonthTransactions.length === 0 ? <p>No transactions found for {formatMonth(selectedMonth)}.</p> : currentMonthTransactions.map(tx => {
                const member = ALL_MEMBERS.find(m => m.id === tx.memberId);
                return (
                  <div key={tx.id} className="list-item" style={{ position: 'relative' }}>
                    <div className="item-main">
                      <span className="item-title">{member?.name || 'Unknown'}</span>
                      <span className="item-subtitle">{member?.group || ''} • {new Date(tx.date).toLocaleDateString()}</span>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                      <span className="item-amount amount-positive">+₹{parseFloat(tx.amount || 0).toLocaleString()}</span>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span className={`badge badge-${tx.method}`}>
                          {tx.method === 'cash' ? 'Cash' : tx.method === 'mom' ? "Mom's A/C" : "Dad's A/C"}
                        </span>
                        <button onClick={() => handleDeleteTransaction(tx.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }} title="Delete Payment">
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Add Payment Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }} onClick={() => setShowAddModal(false)}>
          <div className="card animate-fade-in" style={{ width: '100%', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, paddingBottom: '40px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>Record Payment</h2>
              <button className="btn btn-outline" onClick={() => setShowAddModal(false)} style={{ padding: '8px', borderRadius: '50%' }}>✕</button>
            </div>
            <form onSubmit={handleAddTransaction}>
              <div className="form-group">
                <label className="form-label">Step 1: Select Group</label>
                <select className="form-select" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} required>
                  <option value="">-- Choose Group --</option>
                  {UNIQUE_GROUPS.map(group => <option key={group} value={group}>{group}</option>)}
                </select>
              </div>

              {selectedGroup && (
                <div className="form-group">
                  <label className="form-label">Step 2: Select Member</label>
                  <select name="memberId" className="form-select" required>
                    <option value="">-- Choose Member in {selectedGroup} --</option>
                    {membersInSelectedGroup.sort((a,b) => a.name.localeCompare(b.name)).map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Amount Received (₹)</label>
                <input type="number" name="amount" className="form-input" required placeholder="5000" />
              </div>
              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select name="method" className="form-select" required>
                  <option value="cash">💵 Cash (Given by hand)</option>
                  <option value="mom">🏦 Online - Mom's Account</option>
                  <option value="dad">🏦 Online - Dad's Account</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>Save Payment</button>
            </form>
          </div>
        </div>
      )}

      {/* Method Details Modal */}
      {methodDetailsModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }} onClick={() => setMethodDetailsModal(null)}>
          <div className="card animate-fade-in" style={{ width: '100%', maxHeight: '80vh', overflowY: 'auto', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, paddingBottom: '40px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2>
                {methodDetailsModal === 'cash' ? 'Cash Collections' : methodDetailsModal === 'mom' ? "Mom's Account" : "Dad's Account"}
              </h2>
              <button className="btn btn-outline" onClick={() => setMethodDetailsModal(null)} style={{ padding: '8px', borderRadius: '50%' }}>✕</button>
            </div>
            
            <div>
              {(() => {
                const methodTxs = currentMonthTransactions.filter(t => t.method === methodDetailsModal);
                if (methodTxs.length === 0) return <p>No transactions found for {formatMonth(selectedMonth)}.</p>;
                return methodTxs.map(tx => {
                  const member = ALL_MEMBERS.find(m => m.id === tx.memberId);
                  return (
                    <div key={tx.id} className="list-item" style={{ padding: '12px 0' }}>
                      <div className="item-main">
                        <span className="item-title">{member?.name || 'Unknown'}</span>
                        <span className="item-subtitle">{member?.group || ''} • {new Date(tx.date).toLocaleDateString()}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className="item-amount amount-positive">+₹{parseFloat(tx.amount || 0).toLocaleString()}</span>
                        <button onClick={() => handleDeleteTransaction(tx.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }} title="Delete Payment">
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          <Home />
          <span>Dashboard</span>
        </button>
        <button className={`nav-item ${activeTab === 'members' ? 'active' : ''}`} onClick={() => setActiveTab('members')}>
          <Users />
          <span>Members</span>
        </button>
        <button className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}>
          <ArrowLeftRight />
          <span>History</span>
        </button>
      </nav>
    </div>
  );
}
