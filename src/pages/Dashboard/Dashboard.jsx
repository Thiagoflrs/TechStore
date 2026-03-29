import { useState, useEffect } from "react";
import "./Dashboard.css";
import { 
  FiPackage, FiUsers, FiPlus, FiEdit3, FiTrash2, FiLogOut, FiHome, FiTag,
  FiPlusCircle, FiMinusCircle, FiX, FiCheck 
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("inventory");
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isNovoProdutoModalOpen, setIsNovoProdutoModalOpen] = useState(false);
  
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [tipoExclusao, setTipoExclusao] = useState(""); 
  
  const [novaCatNome, setNovaCatNome] = useState("");
  const [catEditId, setCatEditId] = useState(null);
  const [catEditNome, setCatEditNome] = useState("");

  const [novoProduto, setNovoProduto] = useState({ Nome: "", Valor: 0, Quantidade: 0, CategoriaId: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      carregarDados();
    }
  }, []);

  const carregarDados = async () => {
    const token = localStorage.getItem("token");
    const headers = { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" };
    
    const safeFetch = async (url) => {
      try {
        const res = await fetch(url, { headers });
        if (res.status === 401) { localStorage.clear(); navigate("/login"); return []; }
        if (!res.ok) return []; 
        const data = await res.json();
        return data?.$values || (Array.isArray(data) ? data : []);
      } catch (error) {
        return [];
      }
    };

    try {
      const [resProd, resCat, resUser] = await Promise.all([
        safeFetch("http://localhost:5248/api/Produtos"),
        safeFetch("http://localhost:5248/api/Categorias"),
        safeFetch("http://localhost:5248/api/Usuarios")
      ]);

      setProdutos(resProd || []);
      setCategorias(resCat || []);
      setUsuarios(resUser || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const salvarNovoProduto = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await fetch("http://localhost:5248/api/Produtos", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(novoProduto)
    });
    setIsNovoProdutoModalOpen(false);
    setNovoProduto({ Nome: "", Valor: 0, Quantidade: 0, CategoriaId: "" });
    carregarDados();
  };

  const salvarEdicao = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5248/api/Produtos/${itemSelecionado.ProdutoId}`, {
      method: 'PUT',
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(itemSelecionado)
    });
    setIsEditModalOpen(false);
    carregarDados();
  };

  const alterarQtd = async (id, operacao) => {
    const token = localStorage.getItem("token");
    const pAlvo = produtos?.find(p => p.ProdutoId === id);
    if (!pAlvo) return;
    const novaQtd = operacao === 'add' ? pAlvo.Quantidade + 1 : Math.max(0, pAlvo.Quantidade - 1);
    const pAtu = { ...pAlvo, Quantidade: novaQtd };
    
    setProdutos(prev => prev?.map(p => p.ProdutoId === id ? pAtu : p));
    
    await fetch(`http://localhost:5248/api/Produtos/${id}`, { 
      method: 'PUT', headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(pAtu)
    });
  };

  const confirmarExclusao = async () => {
    const token = localStorage.getItem("token");
    const url = tipoExclusao === "produto" 
      ? `http://localhost:5248/api/Produtos/${itemSelecionado.ProdutoId}` 
      : `http://localhost:5248/api/Usuarios/${itemSelecionado.UsuarioId}`;
    await fetch(url, { method: 'DELETE', headers: { "Authorization": `Bearer ${token}` } });
    setIsDeleteModalOpen(false);
    carregarDados();
  };

  const salvarNovaCategoria = async () => {
    if (!novaCatNome.trim()) return;
    const token = localStorage.getItem("token");
    await fetch("http://localhost:5248/api/Categorias", {
      method: "POST", headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ Nome: novaCatNome })
    });
    setNovaCatNome("");
    carregarDados();
  };

  const excluirCategoria = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5248/api/Categorias/${id}`, { method: 'DELETE', headers: { "Authorization": `Bearer ${token}` } });
    carregarDados();
  };

  const salvarEdicaoCategoria = async (id) => {
    if (!catEditNome.trim()) return;
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:5248/api/Categorias/${id}`, {
        method: 'PUT',
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ CategoriaId: id, Nome: catEditNome })
      });
      setCatEditId(null);
      setCatEditNome("");
      carregarDados();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading-screen">Carregando dados...</div>;

  return (
    <div className="dashboard-container">
      <aside className="sidebar-fixed">
        <div className="sidebar-logo"><h2>TechStore</h2></div>
        <nav className="sidebar-menu">
          <button className={activeTab === "inventory" ? "active" : ""} onClick={() => setActiveTab("inventory")}><FiPackage /> Estoque</button>
          <button className={activeTab === "customers" ? "active" : ""} onClick={() => setActiveTab("customers")}><FiUsers /> Clientes</button>
        </nav>
        <div className="sidebar-bottom">
          <button onClick={() => navigate("/")} className="btn-nav-home"><FiHome /> Loja</button>
          <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="btn-nav-logout"><FiLogOut /> Sair</button>
        </div>
      </aside>

      <main className="dashboard-main">
        {activeTab === "inventory" && (
          <div className="tab-content fade-in">
            <div className="inventory-header">
              <h1>Estoque</h1>
              <div className="header-actions">
                <button className="btn-category" onClick={() => setIsCatModalOpen(true)}><FiTag /> Categorias</button>
                <button className="btn-product" onClick={() => setIsNovoProdutoModalOpen(true)}><FiPlus /> Novo Produto</button>
              </div>
            </div>
            <table className="stock-table">
              <thead>
                <tr><th>ID</th><th>NOME</th><th>CATEGORIA</th><th>VALOR</th><th>QUANTIDADE</th><th>AÇÕES</th></tr>
              </thead>
              <tbody>
                {produtos?.map(p => (
                  <tr key={p.ProdutoId}>
                    <td>#{p.ProdutoId}</td>
                    <td><strong>{p.Nome}</strong></td>
                    <td><span className="cat-badge">{categorias?.find(c => c.CategoriaId === p.CategoriaId)?.Nome || "Geral"}</span></td>
                    <td>R$ {p.Valor?.toFixed(2)}</td>
                    <td className="qtd-number">{p.Quantidade}</td>
                    <td>
                      <div className="stock-actions">
                        <button className="action-btn add" title="Aumentar quantidade" onClick={() => alterarQtd(p.ProdutoId, 'add')}><FiPlusCircle /></button>
                        <button className="action-btn sub" title="Diminuir quantidade" onClick={() => alterarQtd(p.ProdutoId, 'sub')}><FiMinusCircle /></button>
                        <button className="action-btn edit" title="Editar produto" onClick={() => { setItemSelecionado({...p}); setIsEditModalOpen(true); }}><FiEdit3 /></button>
                        <button className="action-btn delete" title="Excluir produto" onClick={() => { setItemSelecionado(p); setTipoExclusao("produto"); setIsDeleteModalOpen(true); }}><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "customers" && (
          <div className="tab-content fade-in">
             <div className="inventory-header"><h1>Clientes</h1></div>
             <table className="stock-table">
              <thead>
                <tr><th>NOME</th><th>EMAIL</th><th>IDADE</th><th>PERFIL</th><th>AÇÕES</th></tr>
              </thead>
              <tbody>
                {usuarios?.map(u => (
                  <tr key={u.UsuarioId}>
                    <td><strong>{u.Nome}</strong></td>
                    <td>{u.Email}</td>
                    <td>{u.Idade} anos</td>
                    <td><span className="cat-badge">{u.Perfil === 0 ? "Admin" : "Cliente"}</span></td>
                    <td><button className="action-btn delete" onClick={() => { setItemSelecionado(u); setTipoExclusao("cliente"); setIsDeleteModalOpen(true); }}><FiTrash2 /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isCatModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content fade-in" style={{ width: '550px' }}>
              <div className="modal-header">
                <h2>Categorias</h2>
                <button className="modal-close-x" onClick={() => { setIsCatModalOpen(false); setCatEditId(null); }}><FiX /></button>
              </div>
              
              <div className="cat-add-row">
                <input type="text" placeholder="Nova Categoria..." value={novaCatNome} onChange={(e) => setNovaCatNome(e.target.value)} />
                <button onClick={salvarNovaCategoria} className="btn-product">Criar</button>
              </div>
              
              <div className="cat-list-container">
                {categorias?.map(c => (
                  <div key={c.CategoriaId} className="cat-item-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
                    {catEditId === c.CategoriaId ? (
                      <div style={{ display: 'flex', gap: '10px', flex: 1, marginRight: '10px' }}>
                        <input 
                          type="text" 
                          value={catEditNome} 
                          onChange={(e) => setCatEditNome(e.target.value)}
                          style={{ flex: 1, padding: '8px 12px', border: '1px solid #3b82f6', borderRadius: '8px', outline: 'none' }}
                          autoFocus
                        />
                        <button className="action-btn add" onClick={() => salvarEdicaoCategoria(c.CategoriaId)} title="Salvar"><FiCheck /></button>
                        <button className="action-btn delete" onClick={() => setCatEditId(null)} title="Cancelar"><FiX /></button>
                      </div>
                    ) : (
                      <>
                        <span style={{ fontWeight: '600', color: '#1e293b' }}>{c.Nome}</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="action-btn edit" onClick={() => { setCatEditId(c.CategoriaId); setCatEditNome(c.Nome); }} title="Editar"><FiEdit3 /></button>
                          <button className="action-btn delete" onClick={() => excluirCategoria(c.CategoriaId)} title="Excluir"><FiTrash2 /></button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {isNovoProdutoModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content fade-in">
              <div className="modal-header">
                <h2>Novo Produto</h2>
                <button className="modal-close-x" onClick={() => setIsNovoProdutoModalOpen(false)}><FiX /></button>
              </div>
              <form onSubmit={salvarNovoProduto}>
                <div className="form-group"><label>Nome</label><input type="text" required value={novoProduto.Nome} onChange={(e) => setNovoProduto({...novoProduto, Nome: e.target.value})} /></div>
                <div className="form-row">
                  <div className="form-group"><label>Valor (R$)</label><input type="number" step="0.01" required value={novoProduto.Valor} onChange={(e) => setNovoProduto({...novoProduto, Valor: parseFloat(e.target.value)})} /></div>
                  <div className="form-group"><label>Quantidade</label><input type="number" required value={novoProduto.Quantidade} onChange={(e) => setNovoProduto({...novoProduto, Quantidade: parseInt(e.target.value)})} /></div>
                </div>
                <div className="form-group">
                  <label>Categoria</label>
                  <select required value={novoProduto.CategoriaId} onChange={(e) => setNovoProduto({...novoProduto, CategoriaId: parseInt(e.target.value)})}>
                    <option value="">Selecione...</option>
                    {categorias?.map(c => <option key={c.CategoriaId} value={c.CategoriaId}>{c.Nome}</option>)}
                  </select>
                </div>
                <div className="modal-footer"><button type="button" className="btn-cancel" onClick={() => setIsNovoProdutoModalOpen(false)}>Cancelar</button><button type="submit" className="btn-save-blue">Cadastrar</button></div>
              </form>
            </div>
          </div>
        )}

        {isEditModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content fade-in">
              <div className="modal-header">
                <h2>Editar Produto</h2>
                <button className="modal-close-x" onClick={() => setIsEditModalOpen(false)}><FiX /></button>
              </div>
              <form onSubmit={salvarEdicao}>
                <div className="form-group"><label>Nome</label><input type="text" value={itemSelecionado?.Nome || ''} onChange={(e) => setItemSelecionado({...itemSelecionado, Nome: e.target.value})} /></div>
                <div className="form-group"><label>Valor</label><input type="number" step="0.01" value={itemSelecionado?.Valor || 0} onChange={(e) => setItemSelecionado({...itemSelecionado, Valor: parseFloat(e.target.value)})} /></div>
                <div className="modal-footer"><button type="button" className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>Cancelar</button><button type="submit" className="btn-save-blue">Salvar</button></div>
              </form>
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="modal-overlay">
            <div className="modal-confirm-new fade-in">
              <button className="modal-close-circle" onClick={() => setIsDeleteModalOpen(false)}><FiX /></button>
              <div className="confirm-icon-box"><FiTrash2 /></div>
              <h3>Confirmar Exclusão</h3>
              <p>Deseja mesmo excluir?</p>
              <h2 className="confirm-item-name">{itemSelecionado?.Nome}</h2>
              <div className="confirm-actions">
                <button className="btn-cancel-gray" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</button>
                <button className="btn-confirm-red" onClick={confirmarExclusao}>Excluir</button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default Dashboard;

//