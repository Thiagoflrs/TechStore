import { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { FiHome, FiBox, FiShoppingBag, FiPlus, FiX, FiDollarSign, FiPieChart, FiUsers, FiGlobe, FiTrendingUp, FiTrash2, FiPlusCircle, FiMinusCircle, FiEdit2, FiTag } from "react-icons/fi";
import "./Dashboard.css";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("visao-geral");
  const [produtos, setProdutos] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [novoProduto, setNovoProduto] = useState({ 
    id: null, nome: "", valor: "", quantidade: "", categoriaId: "", foto: null 
  });
  const [novaCategoriaNome, setNovaCategoriaNome] = useState("");
  const [stockModalConfig, setStockModalConfig] = useState({ id: null, type: 'in', productName: '', quantity: '' });
  const [productToDelete, setProductToDelete] = useState({ id: null, name: '' });

  const getAuthHeaders = () => {
    const userData = JSON.parse(localStorage.getItem("usuario"));
    return { "Authorization": `Bearer ${userData?.token}` };
  };

  const carregarDados = async () => {
    const headers = getAuthHeaders();
    try {
      const resProd = await fetch("http://localhost:5248/api/Produtos", { headers });
      if (resProd.ok) {
        const dadosBrutos = await resProd.json();
        const produtosMapeados = dadosBrutos.map(item => ({
          id: item.ProdutoId,
          nome: item.Nome,
          valor: item.Valor,
          quantidade: item.Quantidade,
          categoriaId: item.CategoriaId
        }));
        setProdutos(produtosMapeados);
      }

      const resUsers = await fetch("http://localhost:5248/api/Usuarios", { headers });
      if (resUsers.ok) setUsuarios(await resUsers.json());

      const resVendas = await fetch("http://localhost:5248/api/Pedidos", { headers });
      if (resVendas.ok) setVendas(await resVendas.json());

      const resCat = await fetch("http://localhost:5248/api/Categorias", { headers });
      if (resCat.ok) setCategorias(await resCat.json());
    } catch (error) {}
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const fMoeda = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n || 0);

  const aplicarMascaraDinheiro = (valor) => {
    let v = String(valor).replace(/[^\d,]/g, ""); 
    v = v.replace(/(\d+)(\d{3})(\d{3})/, "$1.$2.$3");
    v = v.replace(/(\d+)(\d{3})/, "$1.$2");
    if (v.includes(",")) {
      const partes = v.split(",");
      v = partes[0] + "," + partes[1].slice(0, 2); 
    }
    return v ? "R$ " + v : "";
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const valorLimpo = Number(String(novoProduto.valor).replace("R$ ", "").replace(/\./g, "").replace(",", "."));
    
    const formData = new FormData();
    formData.append("Nome", novoProduto.nome);
    formData.append("Valor", valorLimpo);
    formData.append("Quantidade", novoProduto.quantidade);
    formData.append("CategoriaId", novoProduto.categoriaId);
    if (novoProduto.foto) formData.append("foto", novoProduto.foto);

    try {
      const url = novoProduto.id 
        ? `http://localhost:5248/api/Produtos/${novoProduto.id}` 
        : "http://localhost:5248/api/Produtos";
      const metodo = novoProduto.id ? "PUT" : "POST";

      const response = await fetch(url, { 
        method: metodo, 
        headers: getAuthHeaders(),
        body: formData 
      });

      if (response.ok) {
        carregarDados();
        setShowModal(false);
        setNovoProduto({ id: null, nome: "", valor: "", quantidade: "", categoriaId: "", foto: null });
      }
    } catch (error) {}
  };

  const handleEditClick = (p) => {
    setNovoProduto({
      id: p.id,
      nome: p.nome,
      valor: aplicarMascaraDinheiro(String(p.valor)),
      quantidade: p.quantidade,
      categoriaId: p.categoriaId || "",
      foto: null
    });
    setShowModal(true);
  };

  const handleAddCategoria = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5248/api/Categorias", {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ Nome: novaCategoriaNome })
      });

      if (response.ok) {
        carregarDados();
        setShowCatModal(false);
        setNovaCategoriaNome("");
      }
    } catch (error) {}
  };

  const openStockModal = (id, type, productName) => {
    setStockModalConfig({ id, type, productName, quantity: '' });
    setShowStockModal(true);
  };

  const submitStockAction = async (e) => {
    e.preventDefault();
    const { id, type, quantity } = stockModalConfig;
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) return;

    try {
      const endpoint = type === 'in' ? 'ReporEstoque' : 'BaixarEstoque';
      const response = await fetch(`http://localhost:5248/api/Estoque/${endpoint}/${id}`, {
        method: "PATCH",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ Quantidade: Number(quantity) }) 
      });
      if (response.ok) {
        carregarDados();
        setShowStockModal(false);
      }
    } catch (error) {}
  };

  const openDeleteModal = (id, name) => {
    setProductToDelete({ id, name });
    setShowDeleteModal(true);
  };

  const submitDeleteAction = async () => {
    try {
      const response = await fetch(`http://localhost:5248/api/Produtos/${productToDelete.id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      if (response.ok) {
        setProdutos(produtos.filter(p => p.id !== productToDelete.id));
        setShowDeleteModal(false);
      }
    } catch (error) {}
  };

  const getNomeCategoria = (categoriaId) => {
    const catEncontrada = categorias.find(c => 
      c.CategoriaId == categoriaId || 
      c.Id == categoriaId || 
      c.id == categoriaId
    );
    return catEncontrada ? (catEncontrada.Nome || catEncontrada.nome) : "Sem Categoria";
  };

  const renderContent = () => {
    if (activeTab === "visao-geral") {
      return (
        <div className="tab-content fade-in">
          <div className="section-header"><h2>Resumo TechStore</h2></div>
          <div className="main-stats-grid">
            <div className="kpi-card blue">
              <div className="kpi-icon"><FiShoppingBag /></div>
              <div className="kpi-data"><span>Vendas Totais</span><h3>{vendas.length} pedidos</h3></div>
            </div>
            <div className="kpi-card green">
              <div className="kpi-icon"><FiDollarSign /></div>
              <div className="kpi-data"><span>Faturamento Total</span><h3>{fMoeda(vendas.reduce((acc, v) => acc + Number(v.valor || v.Valor || 0), 0))}</h3></div>
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
            <thead><tr><th>ID Venda</th><th>ID Cliente</th><th>Valor</th><th>Status</th></tr></thead>
            <tbody>
              {vendas.map((v, i) => (
                <tr key={i}>
                  <td>#{v.id || v.Id}</td>
                  <td>USR-{v.usuarioId || v.UsuarioId}</td>
                  <td className="txt-green">{fMoeda(v.valor || v.Valor)}</td>
                  <td>{v.status || v.Status || "Processado"}</td>
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
            <h2>Estoque</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-add-item cat-btn" onClick={() => setShowCatModal(true)}>
                <FiTag /> Nova Categoria
              </button>
              <button className="btn-add-item" onClick={() => {
                setNovoProduto({ id: null, nome: "", valor: "", quantidade: "", categoriaId: "", foto: null });
                setShowModal(true);
              }}>
                <FiPlus /> Novo Produto
              </button>
            </div>
          </div>
          <table className="db-table">
            <thead><tr><th>ProdutoId</th><th>Nome</th><th>Categoria</th><th>Valor</th><th>Quantidade</th><th>Ações</th></tr></thead>
            <tbody>
              {produtos.map((p, i) => (
                <tr key={i}>
                  <td><strong>#{p.id}</strong></td>
                  <td><strong>{p.nome}</strong></td>
                  <td><span className="badge-cat">{getNomeCategoria(p.categoriaId)}</span></td>
                  <td>{fMoeda(p.valor)}</td>
                  <td>{p.quantidade} un</td>
                  <td>
                    <div className="actions-group">
                      <button className="action-btn add" onClick={() => openStockModal(p.id, 'in', p.nome)} title="Repor Estoque">
                        <FiPlusCircle size={18} />
                      </button>
                      <button className="action-btn remove" onClick={() => openStockModal(p.id, 'out', p.nome)} title="Baixar Estoque">
                        <FiMinusCircle size={18} />
                      </button>
                      <button className="action-btn edit" onClick={() => handleEditClick(p)} title="Editar Produto">
                        <FiEdit2 size={18} />
                      </button>
                      <button className="action-btn delete" onClick={() => openDeleteModal(p.id, p.nome)} title="Excluir Produto">
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === "graficos") {
      const produtosDisponiveis = produtos.filter(p => p.quantidade > 0).length;
      const produtosEsgotados = produtos.length - produtosDisponiveis;
      const pctDisponivel = produtos.length > 0 ? (produtosDisponiveis / produtos.length) * 100 : 0;
      const pctEsgotado = produtos.length > 0 ? (produtosEsgotados / produtos.length) * 100 : 0;

      const contagemCategorias = {};
      produtos.forEach(p => {
        const nomeCat = getNomeCategoria(p.categoriaId);
        contagemCategorias[nomeCat] = (contagemCategorias[nomeCat] || 0) + 1;
      });
      const listaCategorias = Object.entries(contagemCategorias).sort((a, b) => b[1] - a[1]);

      return (
        <div className="tab-content fade-in">
          <div className="section-header"><h2>Performance</h2></div>
          <div className="charts-grid">
            <div className="chart-card">
              <div className="card-header"><FiGlobe color="#28a745" /> <h3>Clientes na Base</h3></div>
              <div className="client-display">
                <div className="online-circle">
                  <div className="pulse"></div>
                  <strong>{usuarios.length}</strong>
                  <span>Registrados</span>
                </div>
              </div>
            </div>
            
            <div className="chart-card">
              <div className="card-header"><FiPieChart color="#007bff" /> <h3>Status do Estoque</h3></div>
              <div className="rank-list">
                <div className="rank-item">
                  <span>Disponível</span>
                  <div className="bar-bg"><div className="bar-fill blue" style={{width: `${pctDisponivel}%`}}></div></div>
                  <strong>{Math.round(pctDisponivel)}%</strong>
                </div>
                <div className="rank-item">
                  <span>Esgotado</span>
                  <div className="bar-bg"><div className="bar-fill red" style={{width: `${pctEsgotado}%`}}></div></div>
                  <strong>{Math.round(pctEsgotado)}%</strong>
                </div>
              </div>
            </div>

            <div className="chart-card full" style={{ gridColumn: 'span 2' }}>
              <div className="card-header"><FiBox color="#17a2b8" /> <h3>Produtos por Categoria</h3></div>
              <div className="rank-list">
                {listaCategorias.map(([nome, qtd], index) => {
                  const percent = produtos.length > 0 ? (qtd / produtos.length) * 100 : 0;
                  return (
                    <div className="rank-item" key={index}>
                      <span style={{ minWidth: '120px' }}>{nome}</span>
                      <div className="bar-bg"><div className="bar-fill" style={{width: `${percent}%`, backgroundColor: '#17a2b8'}}></div></div>
                      <strong>{qtd} {qtd === 1 ? 'produto' : 'produtos'}</strong>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }
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
            <button className={activeTab === "graficos" ? "active" : ""} onClick={() => setActiveTab("graficos")}><FiPieChart /> Gráficos</button>
          </nav>
        </aside>
        <main className="content-area">{renderContent()}</main>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card fade-in">
            <div className="modal-header">
              <h3>{novoProduto.id ? "Editar Produto" : "Novo Produto"}</h3>
              <button className="btn-close-modal" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSaveProduct}>
              <input type="text" placeholder="Nome do Produto" value={novoProduto.nome} onChange={(e) => setNovoProduto({...novoProduto, nome: e.target.value})} required />
              
              <select 
                value={novoProduto.categoriaId} 
                onChange={(e) => setNovoProduto({...novoProduto, categoriaId: e.target.value})} 
                required
                style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' }}
              >
                <option value="">Selecione uma Categoria</option>
                {categorias.map((c, i) => (
                  <option key={i} value={c.Id || c.id}>{c.Nome || c.nome}</option>
                ))}
              </select>

              <div className="input-row">
                <input type="text" placeholder="R$ 0,00" value={novoProduto.valor} onChange={(e) => setNovoProduto({...novoProduto, valor: aplicarMascaraDinheiro(e.target.value)})} required />
                <input type="text" placeholder="Qtd Inicial" value={novoProduto.quantidade} onChange={(e) => setNovoProduto({...novoProduto, quantidade: e.target.value.replace(/\D/g, "")})} required disabled={!!novoProduto.id} />
              </div>
              <div className="file-upload-box">
                <label htmlFor="file-id" className="custom-file-btn">{novoProduto.foto ? novoProduto.foto.name : "Selecionar Foto"}</label>
                <input id="file-id" type="file" style={{display: 'none'}} onChange={(e) => setNovoProduto({...novoProduto, foto: e.target.files[0]})} />
              </div>
              <button type="submit" className="btn-submit-form">{novoProduto.id ? "Salvar Alterações" : "Confirmar Cadastro"}</button>
            </form>
          </div>
        </div>
      )}

      {showCatModal && (
        <div className="modal-overlay">
          <div className="modal-card fade-in" style={{ width: '350px' }}>
            <div className="modal-header">
              <h3>Nova Categoria</h3>
              <button className="btn-close-modal" onClick={() => setShowCatModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleAddCategoria}>
              <input type="text" placeholder="Nome da Categoria (Ex: Monitores)" value={novaCategoriaNome} onChange={(e) => setNovaCategoriaNome(e.target.value)} required />
              <button type="submit" className="btn-submit-form" style={{ background: '#17a2b8' }}>Salvar Categoria</button>
            </form>
          </div>
        </div>
      )}

      {showStockModal && (
        <div className="modal-overlay">
          <div className="modal-card fade-in" style={{ width: '400px' }}>
            <div className="modal-header">
              <h3>{stockModalConfig.type === 'in' ? "Repor Estoque" : "Baixar Estoque"}</h3>
              <button className="btn-close-modal" onClick={() => setShowStockModal(false)}><FiX /></button>
            </div>
            <form onSubmit={submitStockAction}>
              <p style={{marginBottom: '15px', color: '#666'}}>Produto: <strong>{stockModalConfig.productName}</strong></p>
              <input 
                type="text" 
                placeholder="Quantidade" 
                value={stockModalConfig.quantity} 
                onChange={(e) => setStockModalConfig({...stockModalConfig, quantity: e.target.value.replace(/\D/g, "")})} 
                required 
              />
              <div className="input-row" style={{marginTop: '15px'}}>
                <button type="button" className="btn-submit-form cancel-btn" onClick={() => setShowStockModal(false)}>Cancelar</button>
                <button type="submit" className={`btn-submit-form ${stockModalConfig.type === 'in' ? 'add-btn' : 'remove-btn'}`}>
                  {stockModalConfig.type === 'in' ? "Adicionar" : "Remover"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-card fade-in" style={{ width: '400px', textAlign: 'center' }}>
            <div className="modal-header">
              <h3 style={{color: '#dc3545'}}>Confirmar Exclusão</h3>
              <button className="btn-close-modal" onClick={() => setShowDeleteModal(false)}><FiX /></button>
            </div>
            <div style={{padding: '20px 0'}}>
              <FiTrash2 size={50} color="#dc3545" style={{marginBottom: '15px'}}/>
              <p>Tem certeza que deseja excluir o produto?</p>
              <strong style={{fontSize: '18px'}}>{productToDelete.name}</strong>
              <p style={{fontSize: '12px', color: '#999', marginTop: '10px'}}>Esta ação não poderá ser desfeita.</p>
            </div>
            <div className="input-row">
              <button type="button" className="btn-submit-form cancel-btn" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
              <button type="button" className="btn-submit-form remove-btn" onClick={submitDeleteAction}>Excluir</button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Dashboard;