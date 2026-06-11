import React, { useState, useEffect } from 'react';

import { db } from './firebase';

import { collection, onSnapshot, addDoc, orderBy, query, writeBatch, doc } from 'firebase/firestore';

import { Home, Users, ArrowLeftRight, Plus, Wallet, Landmark, UploadCloud } from 'lucide-react';



export default function App() {

  const [activeTab, setActiveTab] = useState('dashboard');

  const [showAddModal, setShowAddModal] = useState(false);

  const [members, setMembers] = useState([]);

  const [transactions, setTransactions] = useState([]);

  const [selectedGroup, setSelectedGroup] = useState('');

  const [membersTabGroupFilter, setMembersTabGroupFilter] = useState('');



  useEffect(() => {

    const unsubscribeMembers = onSnapshot(collection(db, 'members'), (snapshot) => {

      const membersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setMembers(membersData);

    });



    const q = query(collection(db, 'transactions'), orderBy('date', 'desc'));

    const unsubscribeTx = onSnapshot(q, (snapshot) => {

      const txData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setTransactions(txData);

    });



    return () => {

      unsubscribeMembers();

      unsubscribeTx();

    };

  }, []);



  const totalCollected = transactions.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

  const cashCollected = transactions.filter(t => t.method === 'cash').reduce((s, t) => s + parseFloat(t.amount || 0), 0);

  const momCollected = transactions.filter(t => t.method === 'mom').reduce((s, t) => s + parseFloat(t.amount || 0), 0);

  const dadCollected = transactions.filter(t => t.method === 'dad').reduce((s, t) => s + parseFloat(t.amount || 0), 0);



  const groupedMembers = members.reduce((acc, m) => {

    const groupName = m.group || 'Unassigned';

    if (!acc[groupName]) acc[groupName] = [];

    acc[groupName].push(m);

    return acc;

  }, {});



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

      alert("Database error: Ensure Firestore is created.");

    }

  };



  const handleAddMember = async (e) => {

    e.preventDefault();

    const formData = new FormData(e.target);

    const name = formData.get('name');

    const group = formData.get('group');

    

    try {

      await addDoc(collection(db, 'members'), { name, group });

      e.target.reset();

    } catch (error) {

      console.error("Error adding member:", error);

      alert("Database error: Ensure Firestore is created.");

    }

  };



  const handleBulkImport = async () => {

    const dummyDataToImport = [

      { group: "Rama", name: "Chllyyamma tamarana" },

      { group: "Rama", name: "Demudamma Tamarana" },

      { group: "Rama", name: "Demuduamma lalam" },

      { group: "Rama", name: "Demudamma paila" },

      { group: "Rama", name: "Ramanamma lalam" },

      { group: "Rama", name: "Lakshmi paila" },

      { group: "Rama", name: "Achiyyamma tamarana" },

      { group: "Rama", name: "Santhi pyla" },

      { group: "Rama", name: "Ramalaxmi Reddi" },

      { group: "Rama", name: "PylaBhavani Pyla" },

      { group: "Rama", name: "suneetha tamirana" },

      { group: "Sri Anjaneya", name: "Ammaji Pyla" },

      { group: "Sri Anjaneya", name: "Ashalatha Kotani" },

      { group: "Sri Anjaneya", name: "Kumari Bandaru" },

      { group: "Sri Anjaneya", name: "Manga Reddi" },

      { group: "Sri Anjaneya", name: "Neelamani Bailapudi" },

      { group: "Sri Anjaneya", name: "Sarojani Lalam" },

      { group: "Sri Anjaneya", name: "Venkatalakshmi Bandaru" },

      { group: "Sri Anjaneya", name: "Venkati Lalam" },

      { group: "Sri Anjaneya", name: "PylaPriyanka Pyla" },

      { group: "Sri Anjaneya", name: "PAILA HEMA PAILA" },

      { group: "SRI CHODAMAMBICA SHG", name: "Pyla Laksmi PYLA" },

      { group: "SRI CHODAMAMBICA SHG", name: "RONGALI JYOTHI RONGALI" },

      { group: "SRI CHODAMAMBICA SHG", name: "Kundrapu Devi KUNDRAPU" },

      { group: "SRI CHODAMAMBICA SHG", name: "PYLA LAXMI PYLA" },

      { group: "SRI CHODAMAMBICA SHG", name: "Paila Aruna Kumari PAILA" },

      { group: "SRI CHODAMAMBICA SHG", name: "PYLA SAROJINI PALA" },

      { group: "SRI CHODAMAMBICA SHG", name: "Kundrapu Ramadevi KUNDRAPU" },

      { group: "SRI CHODAMAMBICA SHG", name: "Kundrapu Ramadevi KUNDRAPU" },

      { group: "SRI CHODAMAMBICA SHG", name: "PYLA DEVI PYLA" },

      { group: "SRI DURGA DEVI SHG", name: "CHINTHALLI THAMARANA" },

      { group: "SRI DURGA DEVI SHG", name: "VIJAYA THAMARANA" },

      { group: "SRI DURGA DEVI SHG", name: "Reddi Ammaji REDDI" },

      { group: "SRI DURGA DEVI SHG", name: "Kotani Venkatasravani KOTANI" },

      { group: "SRI DURGA DEVI SHG", name: "RAMYA lalam" },

      { group: "SRI DURGA DEVI SHG", name: "VARALAXMI lalam" },

      { group: "SRI DURGA DEVI SHG", name: "VIJAYA pyla" },

      { group: "SRI DURGA DEVI SHG", name: "SANDHYA thamarana" },

      { group: "SRI DURGA DEVI SHG", name: "BADHRA KALI LAVANYA kondapalli" },

      { group: "SRI DURGA DEVI SHG", name: "Sirsha Reddi" },

      { group: "Sri Kanaka Durga", name: "Devudamma pyla" },

      { group: "Sri Kanaka Durga", name: "Devudamma pyla" },

      { group: "Sri Kanaka Durga", name: "Sanyasamma paila" },

      { group: "Sri Kanaka Durga", name: "Laxmi reddi" },

      { group: "Sri Kanaka Durga", name: "Simhachalam pyla" },

      { group: "Sri Kanaka Durga", name: "Krishnaveni pyla" },

      { group: "Sri Kanaka Durga", name: "PAILA CHANTI PAILA" },

      { group: "Sri Kanaka Durga", name: "RUTHALA LAKSHMI RUTHALA" },

      { group: "Sri Kanaka Durga", name: "RAMANAMMA kolli" },

      { group: "Sri Kanaka Durga", name: "NAGAMANI Dasari" },

      { group: "Krishna", name: "Lakshmi lalam" },

      { group: "Krishna", name: "Lakshmi palia" },

      { group: "Krishna", name: "Yerryyamma reddi" },

      { group: "Krishna", name: "Sanyasama tamarana" },

      { group: "Krishna", name: "Ramulamma bandaru" },

      { group: "Krishna", name: "Varalakshmi paila" },

      { group: "Krishna", name: "Savitri dasari" },

      { group: "Krishna", name: "Varalakshmi paila" },

      { group: "Krishna", name: "navya paila" },

      { group: "Krishna", name: "paila padmalatha paila" },

      { group: "PARIPALAMMA SHG", name: "DEMUDAMMA KUNDRAPU" },

      { group: "PARIPALAMMA SHG", name: "KRISHNAVENI PAILA" },

      { group: "PARIPALAMMA SHG", name: "KRISHNAVENI PAILA" },

      { group: "PARIPALAMMA SHG", name: "LAXMI RONGALI" },

      { group: "PARIPALAMMA SHG", name: "LAXMI PAILA" },

      { group: "PARIPALAMMA SHG", name: "PADMA PAILA" },

      { group: "PARIPALAMMA SHG", name: "SOMULAMMA PAILA" },

      { group: "PARIPALAMMA SHG", name: "SYAMALA RONGALI" },

      { group: "Sri Lakshmana", name: "Lakshmi ruttula" },

      { group: "Sri Lakshmana", name: "Parvathi lalam" },

      { group: "Sri Lakshmana", name: "Devi tamarana" },

      { group: "Sri Lakshmana", name: "Ramani tamarana" },

      { group: "Sri Lakshmana", name: "Pailaramoji paila" },

      { group: "Sri Lakshmana", name: "Kumari lalam" },

      { group: "Sri Lakshmana", name: "Chandramma tamarana" },

      { group: "Sri Lakshmana", name: "Krishnamma lalam" },

      { group: "Sri Lakshmana", name: "Kondamma paila" },

      { group: "Sri Lakshmana", name: "Sarmjini Reddi" },

      { group: "Sri Vinayaka", name: "Paiditalli reddy" },

      { group: "Sri Vinayaka", name: "Yerayyamma reddy" },

      { group: "Sri Vinayaka", name: "Gangamma lalam" },

      { group: "Sri Vinayaka", name: "Devudamma bandaru" },

      { group: "Sri Vinayaka", name: "Demudamma kundrapu" },

      { group: "Sri Vinayaka", name: "Bhavanani Pyla" },

      { group: "Sri Vinayaka", name: "Lalam Sunitha LALAM" },

      { group: "Sri Vinayaka", name: "SRUTHI ruttala" },

      { group: "Sri Vinayaka", name: "Ramalakshmi Puliga" },

      { group: "Sri Vinayaka", name: "ROSINI MASARAPU" },

      { group: "Sri Vinayaka", name: "KOTA DIVYA BHARATHI KOTA" },

      { group: "Sri Sita", name: "Laxmi paila" },

      { group: "Sri Sita", name: "Paiditalli paila" },

      { group: "Sri Sita", name: "Jayalakshmi paila" },

      { group: "Sri Sita", name: "Sathyavathi paila" },

      { group: "Sri Sita", name: "Kalyani paila" },

      { group: "Sri Sita", name: "Adilakshmi reddi" },

      { group: "Sri Sita", name: "Nookaratnam Lalam" },

      { group: "Sri Sita", name: "Demudamma paila" },

      { group: "Sri Sita", name: "saroja pyla" },

      { group: "Sri Sita", name: "rongaliasravani rongala" },

      { group: "Sri Sita", name: "Pushpa Reddi" },

      { group: "Sri Santhoshimatha", name: "Paiditalli tamarana" },

      { group: "Sri Santhoshimatha", name: "Sanyasamma tamarana" },

      { group: "Sri Santhoshimatha", name: "Kumari tamarana" },

      { group: "Sri Santhoshimatha", name: "Demudamma reddi" },

      { group: "Sri Santhoshimatha", name: "Ramanamma tamarana" },

      { group: "Sri Santhoshimatha", name: "Devudamma paila" },

      { group: "Sri Santhoshimatha", name: "Devi tamarana" },

      { group: "Sri Santhoshimatha", name: "Padma tamarana" },

      { group: "Sri Santhoshimatha", name: "Adigarlajyothi Adigarla" },

      { group: "Sri Santhoshimatha", name: "SAROJA kundrapu" },

      { group: "Sri Santhoshimatha", name: "SUDHARANI thamirana" },

      { group: "Sri Santhoshimatha", name: "varalakshmi Tamarana" },

      { group: "Sri Manikanta", name: "Varalakshmi bailapudi" },

      { group: "Sri Manikanta", name: "Chittamma Tamarana" },

      { group: "Sri Manikanta", name: "Reddy paila" },

      { group: "Sri Manikanta", name: "Varalakshmi kandregula" },

      { group: "Sri Manikanta", name: "Devi Rongala" },

      { group: "Sri Manikanta", name: "Ramani Adigarla" },

      { group: "Sri Manikanta", name: "Pyla Venkata Laxmi PYLA" },

      { group: "Sri Manikanta", name: "ARUNA rongala" },

      { group: "Sri Manikanta", name: "SATYAVATHI reddy" },

      { group: "Sri Manikanta", name: "chittamma tamarana" },

      { group: "SRI LAKSHMI SHG", name: "Annamreddy Suneetha annamreddy" },

      { group: "SRI LAKSHMI SHG", name: "MATHALA KUMARI mathala" },

      { group: "SRI LAKSHMI SHG", name: "Karri Devi karri" },

      { group: "SRI LAKSHMI SHG", name: "Gandi Rohini gandi" },

      { group: "SRI LAKSHMI SHG", name: "KOLLI VENKATALAKSHMI kolli" },

      { group: "SRI LAKSHMI SHG", name: "Saritha pyla" },

      { group: "SRI LAKSHMI SHG", name: "Yalla Neeraja yalla" },

      { group: "SRI LAKSHMI SHG", name: "Ramadavi Gelli" },

      { group: "SRI LAKSHMI SHG", name: "Manju Reddi" },

      { group: "SRI LAKSHMI SHG", name: "THARALA RAJESARI THAMARALA" },

      { group: "Paripillamma l", name: "Varahalamma lalam" },

      { group: "Paripillamma l", name: "Chinatalli reddi" },

      { group: "Paripillamma l", name: "Devudamma reddi" },

      { group: "Paripillamma l", name: "Lakshmi reddi" },

      { group: "Paripillamma l", name: "Muthyalama bandaru" },

      { group: "Paripillamma l", name: "Sanyasamma reddi" },

      { group: "Paripillamma l", name: "Ramulamma Reddi" },

      { group: "Paripillamma l", name: "Devudamma reddi" },

      { group: "Paripillamma l", name: "Devudamma reddy" },

      { group: "Paripillamma l", name: "Ramulamma reddy" },

      { group: "Paripillamma l", name: "RAMADEVI reddy" },

      { group: "Paripillamma l", name: "Satyavathi Boddu" },

      { group: "Paripillamma", name: "Chittamma tamarana" },

      { group: "Paripillamma", name: "Papa ruthula" },

      { group: "Paripillamma", name: "Papa reddy" },

      { group: "Paripillamma", name: "Somulamma reddy" },

      { group: "Paripillamma", name: "Arunasri A Parvathi Lalam" },

      { group: "Paripillamma", name: "Chinnammalu Paila" },

      { group: "Paripillamma", name: "Nagalakshmi Ruttala" },

      { group: "Paripillamma", name: "Nagamani Paila" },

      { group: "Paripillamma", name: "Tulasi Paila" },

      { group: "Paripillamma", name: "Naayanamma Narayanamma" },

      { group: "Maridimamba", name: "Venkata kundra" },

      { group: "Maridimamba", name: "Shivalakshmi kotana" },

      { group: "Maridimamba", name: "Ratnam sabbavarapu" },

      { group: "Maridimamba", name: "Satyavati paila" },

      { group: "Maridimamba", name: "Achiyamma paila" },

      { group: "Maridimamba", name: "Sanyasamma tamarana" },

      { group: "Maridimamba", name: "Lakshmi tamarana" },

      { group: "Maridimamba", name: "Ramathalli tamarana" },

      { group: "Maridimamba", name: "Nookalamma kundrapui" },

      { group: "Maridimamba", name: "Sireesha Lalam" }

    ];





    if (window.confirm(`Do you want to import ${dummyDataToImport.length} members?`)) {

      try {

        const batch = writeBatch(db);

        dummyDataToImport.forEach(member => {

          const docRef = doc(collection(db, 'members'));

          batch.set(docRef, member);

        });

        await batch.commit();

        alert("Import successful!");

      } catch (error) {

        console.error("Import error:", error);

        alert("Failed to import. Check Firebase permissions.");

      }

    }

  };



  const uniqueGroups = [...new Set(members.map(m => m.group || 'Unassigned'))].sort();

  const membersInSelectedGroup = members.filter(m => (m.group || 'Unassigned') === selectedGroup);



  return (

    <div className="app-container">

      {/* Header */}

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>

        <div>

          <h1>DWCRA Tracker</h1>

          <p>Welcome back!</p>

        </div>

        <button className="btn btn-primary" onClick={() => setShowAddModal(true)} style={{ padding: '12px', borderRadius: '50%' }}>

          <Plus size={24} />

        </button>

      </header>



      {/* Main Content */}

      <main className="animate-fade-in">

        {activeTab === 'dashboard' && (

          <div>

            <div className="stats-grid">

              <div className="stat-card primary card" style={{ gridColumn: 'span 2' }}>

                <span className="stat-label">Total Collected</span>

                <h3>₹{totalCollected.toLocaleString()}</h3>

              </div>

              <div className="stat-card card">

                <span className="stat-label">Active Groups</span>

                <span className="stat-value">{Object.keys(groupedMembers).length}</span>

              </div>

              <div className="stat-card card">

                <span className="stat-label">Total Members</span>

                <span className="stat-value">{members.length}</span>

              </div>

            </div>



            <h3 style={{ marginTop: '32px', marginBottom: '16px' }}>Collection Breakdown</h3>

            <div className="card" style={{ padding: '0' }}>

              <div className="list-item" style={{ boxShadow: 'none', marginBottom: '0', borderBottom: '1px solid var(--surface-border)' }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

                  <div style={{ background: 'var(--success-bg)', padding: '10px', borderRadius: '12px', color: 'var(--success)' }}><Wallet size={20} /></div>

                  <span className="item-title">Cash on Hand</span>

                </div>

                <span className="item-amount amount-positive">₹{cashCollected.toLocaleString()}</span>

              </div>

              <div className="list-item" style={{ boxShadow: 'none', marginBottom: '0', borderBottom: '1px solid var(--surface-border)' }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

                  <div style={{ background: 'var(--warning-bg)', padding: '10px', borderRadius: '12px', color: 'var(--warning)' }}><Landmark size={20} /></div>

                  <span className="item-title">Mom's Account</span>

                </div>

                <span className="item-amount amount-positive">₹{momCollected.toLocaleString()}</span>

              </div>

              <div className="list-item" style={{ boxShadow: 'none', marginBottom: '0' }}>

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

            <div className="card" style={{ marginBottom: '24px' }}>

              <h3>Add Individual Member</h3>

              <form onSubmit={handleAddMember} style={{ marginTop: '16px' }}>

                <div className="form-group">

                  <label className="form-label">Group Name</label>

                  <input type="text" name="group" className="form-input" required placeholder="e.g. Group 1" />

                </div>

                <div className="form-group">

                  <label className="form-label">Member Name</label>

                  <input type="text" name="name" className="form-input" required placeholder="e.g. Lakshmi" />

                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Member</button>

              </form>

            </div>



            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>

              <h3>Members by Group</h3>

              {members.length === 0 && (

                <button onClick={handleBulkImport} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>

                  <UploadCloud size={16} /> Seed Data

                </button>

              )}

            </div>

            

            <div style={{ marginTop: '16px' }}>

              {Object.keys(groupedMembers).length > 0 && (

                <div className="form-group" style={{ marginBottom: '24px' }}>

                  <select 

                    className="form-select" 

                    value={membersTabGroupFilter} 

                    onChange={(e) => setMembersTabGroupFilter(e.target.value)}

                  >

                    <option value="">-- View All Groups --</option>

                    {uniqueGroups.map(group => <option key={group} value={group}>{group}</option>)}

                  </select>

                </div>

              )}



              {Object.keys(groupedMembers).length === 0 ? <p>No members added yet.</p> : 

                Object.keys(groupedMembers)

                  .filter(groupName => membersTabGroupFilter === '' || groupName === membersTabGroupFilter)

                  .sort()

                  .map(groupName => (

                  <div key={groupName} style={{ marginBottom: '24px' }}>

                    <h4 style={{ color: 'var(--primary-shadow)', marginBottom: '8px', borderBottom: '2px solid rgba(99, 102, 241, 0.2)', paddingBottom: '4px' }}>{groupName}</h4>

                    {groupedMembers[groupName].sort((a,b) => a.name.localeCompare(b.name)).map(m => {

                      const memberTxs = transactions.filter(t => t.memberId === m.id);

                      const memberTotalPaid = memberTxs.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

                      

                      return (

                        <div key={m.id} className="list-item">

                          <div className="item-main">

                            <span className="item-title">{m.name}</span>

                          </div>

                          <div style={{ textAlign: 'right' }}>

                            <span className="item-subtitle">Total Paid</span>

                            <div className="item-amount amount-positive">₹{memberTotalPaid.toLocaleString()}</div>

                          </div>

                        </div>

                      )

                    })}

                  </div>

                ))

              }

            </div>

          </div>

        )}



        {activeTab === 'transactions' && (

          <div>

            <h3>Recent Transactions</h3>

            <div style={{ marginTop: '16px' }}>

              {transactions.length === 0 ? <p>No transactions yet.</p> : transactions.map(tx => {

                const member = members.find(m => m.id === tx.memberId);

                return (

                  <div key={tx.id} className="list-item">

                    <div className="item-main">

                      <span className="item-title">{member?.name || 'Unknown'}</span>

                      <span className="item-subtitle">{member?.group || ''} • {new Date(tx.date).toLocaleDateString()}</span>

                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>

                      <span className="item-amount amount-positive">+₹{parseFloat(tx.amount || 0).toLocaleString()}</span>

                      <span className={`badge badge-${tx.method}`}>

                        {tx.method === 'cash' ? 'Cash' : tx.method === 'mom' ? "Mom's A/C" : "Dad's A/C"}

                      </span>

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

                  {uniqueGroups.map(group => <option key={group} value={group}>{group}</option>)}

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

