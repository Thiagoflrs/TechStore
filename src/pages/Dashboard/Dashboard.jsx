import { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { FiHome, FiBox, FiShoppingBag, FiPlus, FiX, FiDollarSign, FiCreditCard, FiPieChart, FiTrendingUp, FiTrendingDown, FiUsers, FiGlobe } from "react-icons/fi";
import "./Dashboard.css";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("visao-geral");
  const [produtos, setProdutos] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [novoProduto, setNovoProduto] = useState({ 
    id: "#", nome: "", preco: "", estoque: "", categoria: "", foto: null 
  });

  // Dados simulados para o gráfico de clientes
  const dadosClientes = {
    total: 1240,
    onlineAgora: 87, // Nova informação solicitada
    novosHoje: 14
  };

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const resProd = await fetch("http://localhost:3000/produtos");
        const dadosProd = await resProd.json();
        setProdutos(Array.isArray(dadosProd) ? dadosProd : []);

        const resVendas = await fetch("http://localhost:3000/vendas");
        const dadosVendas = await resVendas.json();
        setVendas(Array.isArray(dadosVendas) ? dadosVendas : []);
      } catch (error) { 
        console.error("Erro na API:", error); 
      }
    };
    carregarDados();
  }, []);

  const fMoeda = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n || 0);

  const handleIdChange = (e) => {
    let valor = e.target.value;
    if (!valor.startsWith("#")) valor = "#" + valor.replace("#", "");
    setNovoProduto({ ...novoProduto, id: valor });
  };

  const aplicarMascaraDinheiro = (valor) => {
    let v = valor.replace(/[^\d,]/g, ""); 
    v = v.replace(/(\d+)(\d{3})(\d{3})/, "$1.$2.$3");
    v = v.replace(/(\d+)(\d{3})/, "$1.$2");
    if (v.includes(",")) {
      const partes = v.split(",");
      v = partes[0] + "," + partes[1].slice(0, 2); 
    }
    return v ? "R$ " + v : "";
  };

  const converterParaNumeroDB = (stringMoeda) => {
    if (!stringMoeda) return 0;
    return Number(stringMoeda.replace("R$ ", "").replace(/\./g, "").replace(",", "."));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", novoProduto.id);
    formData.append("nome", novoProduto.nome);
    formData.append("preco", converterParaNumeroDB(novoProduto.preco));
    formData.append("estoque", novoProduto.estoque);
    formData.append("categoria", novoProduto.categoria);
    if (novoProduto.foto) formData.append("foto", novoProduto.foto);

    try {
      const response = await fetch("http://localhost:3000/produtos", { method: "POST", body: formData });
      if (response.ok) {
        const salvo = await response.json();
        setProdutos([...produtos, salvo]);
        setShowModal(false);
        setNovoProduto({ id: "#", nome: "", preco: "", estoque: "", categoria: "", foto: null });
      }
    } catch (error) { alert("Erro ao salvar produto."); }
  };

  const renderContent = () => {
    if (activeTab === "visao-geral") {
      return (
        <div className="tab-content fade-in">
          <div className="section-header"><h2>Resumo TechStore</h2></div>
          <div className="main-stats-grid">
            <div className="kpi-card blue">
              <div className="kpi-icon"><FiShoppingBag /></div>
              <div className="kpi-data"><span>Vendas Totais</span><h3>{vendas.length}</h3></div>
            </div>
            <div className="kpi-card green">
              <div className="kpi-icon"><FiDollarSign /></div>
              <div className="kpi-data"><span>Faturamento</span><h3>{fMoeda(vendas.reduce((acc, v) => acc + Number(v.valor || 0), 0))}</h3></div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "graficos") {
      return (
        <div className="tab-content fade-in">
          <div className="section-header"><h2>Relatórios e Performance</h2></div>
          <div className="charts-grid">
            <div className="chart-card">
              <div className="card-header"><FiTrendingUp color="#007bff" /> <h3>Mais Vendidos</h3></div>
              <div className="rank-list">
                <div className="rank-item"><span>PS5 Console</span><div className="bar-bg"><div className="bar-fill blue" style={{width: '90%'}}></div></div><strong>45</strong></div>
                <div className="rank-item"><span>Mouse RGB</span><div className="bar-bg"><div className="bar-fill blue" style={{width: '70%'}}></div></div><strong>32</strong></div>
              </div>
            </div>
            
            <div className="chart-card">
              <div className="card-header"><FiTrendingDown color="#dc3545" /> <h3>Baixa Rotatividade</h3></div>
              <div className="rank-list">
                <div className="rank-item"><span>Cabo VGA</span><div className="bar-bg"><div className="bar-fill red" style={{width: '10%'}}></div></div><strong>1</strong></div>
                <div className="rank-item"><span>Webcam 480p</span><div className="bar-bg"><div className="bar-fill red" style={{width: '20%'}}></div></div><strong>4</strong></div>
              </div>
            </div>

            <div className="chart-card full">
              <div className="card-header"><FiDollarSign color="#28a745" /> <h3>Evolução Financeira (Mensal)</h3></div>
              <div className="finance-chart">
                {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"].map((m, i) => (
                  <div key={m} className="fin-bar-wrapper">
                    <div className="fin-bar" style={{height: `${[30, 50, 45, 80, 65, 90][i]}%`}}></div>
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AREA DE CLIENTES ATUALIZADA */}
            <div className="chart-card full no-border">
              <div className="client-stats-split">
                <div className="client-sub-card">
                    <div className="card-header"><FiUsers color="#007bff" /> <h3>Total de Clientes</h3></div>
                    <div className="client-box">
                        <div className="client-circle blue"><strong>{dadosClientes.total}</strong><span>registrados</span></div>
                        <div className="client-data"><p>Novos hoje: <span className="txt-green">+{dadosClientes.novosHoje}</span></p></div>
                    </div>
                </div>
                
                {/* NOVO CARD: CLIENTES ONLINE SOLICITADO */}
                <div className="client-sub-card online">
                    <div className="card-header"><FiGlobe color="#28a745" /> <h3>Clientes Online Agora</h3></div>
                    <div className="client-box">
                        <div className="client-circle green">
                            <div className="online-pulse"></div>
                            <strong>{dadosClientes.onlineAgora}</strong>
                            <span>usuários</span>
                        </div>
                        <div className="client-data"><p>Tráfego: <span className="txt-green">Normal</span></p></div>
                    </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      );
    }

    if (activeTab === "vendas") {
      return (
        <div className="tab-content fade-in">
          <div className="section-header"><h2>Histórico de Vendas</h2></div>
          <table className="db-table">
            <thead>
              <tr><th>ID Venda</th><th>ID Cliente</th><th>Valor</th><th>Pagamento</th></tr>
            </thead>
            <tbody>
              {vendas.map((v, i) => (
                <tr key={v.id || i}>
                  <td>#{v.id}</td>
                  <td>USR-{v.cliente_id}</td>
                  <td className="txt-green">{fMoeda(v.valor)}</td>
                  <td><span className="pay-method"><FiCreditCard /> {v.forma_pagamento || "Cartão"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === "inventario") {
      return (
        <div className="tab-content fade-in">
          <div className="inventory-header">
            <h2>Estoque e Categorias</h2>
            <button className="btn-add-item" onClick={() => setShowModal(true)}><FiPlus /> Novo Produto</button>
          </div>
          <table className="db-table">
            <thead>
              <tr><th>ID</th><th>Produto</th><th>Categoria</th><th>Preço</th><th>Quantidade</th></tr>
            </thead>
            <tbody>
              {produtos.map((p, i) => (
                <tr key={p.id || i}>
                  <td>{p.id}</td>
                  <td><strong>{p.nome}</strong></td>
                  <td><span className="badge-cat">{p.categoria || "Geral"}</span></td>
                  <td>{fMoeda(p.preco)}</td>
                  <td>{p.estoque} unidades</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    
    return <div className="tab-content"><h2>Aba em desenvolvimento</h2></div>;
  };

  return (
    <div className="dashboard-wrapper">
      <Header />
      <div className="dashboard-layout">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <button className={activeTab === "visao-geral" ? "active" : ""} onClick={() => setActiveTab("visao-geral")}><FiHome /> Home</button>
            <button className={activeTab === "vendas" ? "active" : ""} onClick={() => setActiveTab("vendas")}><FiShoppingBag /> Vendas</button>
            <button className={activeTab === "inventario" ? "active" : ""} onClick={() => setActiveTab("inventario")}><FiBox /> Estoque</button>
            <button className={activeTab === "graficos" ? "active" : ""} onClick={() => setActiveTab("graficos")}><FiPieChart /> Analytics</button>
          </nav>
        </aside>
        <main className="content-area">
          {renderContent()}
        </main>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card fade-in">
            <div className="modal-header">
              <h3>Novo Produto</h3>
              <button className="btn-close-modal" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleAddProduct}>
              <input type="text" placeholder="ID" value={novoProduto.id} onChange={handleIdChange} required />
              <input type="text" placeholder="Nome do Produto" value={novoProduto.nome} onChange={(e) => setNovoProduto({...novoProduto, nome: e.target.value})} required />
              <input type="text" placeholder="Categoria" value={novoProduto.categoria} onChange={(e) => setNovoProduto({...novoProduto, categoria: e.target.value})} required />
              
              <div className="input-row">
                <input type="text" placeholder="R$ 0,00" value={novoProduto.preco} onChange={(e) => setNovoProduto({...novoProduto, preco: aplicarMascaraDinheiro(e.target.value)})} required />
                <input type="text" placeholder="Quantidade" value={novoProduto.estoque} onChange={(e) => setNovoProduto({...novoProduto, estoque: e.target.value.replace(/\D/g, "")})} required />
              </div>

              <div className="file-upload-section">
                <label htmlFor="file-upload-id" className="custom-file-btn">
                  {novoProduto.foto ? `Selecionado: ${novoProduto.foto.name}` : "Selecionar Foto"}
                </label>
                <input id="file-upload-id" type="file" className="hidden-input" onChange={(e) => setNovoProduto({...novoProduto, foto: e.target.files[0]})} />
              </div>

              <button type="submit" className="btn-submit-form">Confirmar Cadastro</button>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Dashboard;