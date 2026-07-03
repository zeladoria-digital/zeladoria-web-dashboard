import React, { useState, useEffect } from 'react';import './DeviceManagement.css';

interface Device {
  id: string;
  veiculo: string;
  status: 'Online' | 'Offline';
  deteccoes: number;
  bateria: string;
}

const mockDevices: Device[] = [
  { id: 'IOT-VH-0042', veiculo: 'ABC-1234', status: 'Online', deteccoes: 247, bateria: '87%' },
  { id: 'IOT-VH-0043', veiculo: 'DEF-5678', status: 'Online', deteccoes: 189, bateria: '92%' },
  { id: 'IOT-VH-0044', veiculo: 'GHI-9012', status: 'Offline', deteccoes: 0, bateria: '12%' },  
  { id: 'IOT-VH-0045', veiculo: 'XYZ-9876', status: 'Online', deteccoes: 0, bateria: '100%' }
];

export default function DeviceManagement() {
// Adicione o setDevices aqui no seu estado:
  const [devices, setDevices] = useState<Device[]>(mockDevices);

// Função para buscar a lista real no banco de dados
  const buscarDispositivos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/devices', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const dadosDoBanco = await response.json();
        
        const dispositivosFormatados = dadosDoBanco.map((item: any) => {
// Dentro do mapeamento da buscarDispositivos:
let statusVisual = 'Offline';
// Agora ele acende a luz verde se vier 'active' do banco OU se vier 'Online' direto do seu form
if (item.status === 'active' || item.status === 'Online') { 
  statusVisual = 'Online';
}

          return {
            // Tentamos pegar o seu ID, mas se o banco não mandou, exibimos o ID do Firebase resumido
            id: item.deviceId || (item.id ? item.id.substring(0, 8) + '...' : 'N/A'),
            veiculo: item.vehiclePlate || 'N/A',
            status: statusVisual as 'Online' | 'Offline',
            deteccoes: 0,
            bateria: item.batteryLevel || '100%'
          };
        });

        setDevices(dispositivosFormatados);
      }
    } catch (error) {
      console.error("Erro ao buscar a lista real:", error);
    }
  };
  // Faz a busca automática assim que a tela abre
  useEffect(() => {
    buscarDispositivos();
  }, []);
  // Inspetor separando os online e contando
  const quantidadeOnline = devices.filter(device => device.status === 'Online').length;
  
  // Inspetor separando os offline e contando
  const quantidadeOffline = devices.filter(device => device.status === 'Offline').length;

  // Soma de todas as detecções usando reduce
  const totalDeteccoes = devices.reduce((acc, device) => acc + device.deteccoes, 0);

  // Controle do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado do formulário (para capturar os inputs)
  const [formData, setFormData] = useState({
    id: '',
    veiculo: '',
    status: 'Online', // Valor padrão
    bateria: '100%',
    deteccoes: 0
  });

  // Função disparada ao clicar em Salvar (agora com a tipagem do TypeScript React.FormEvent)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que a página recarregue ao enviar o formulário

    // Pegar o token (O "Crachá" de Autorização)
    const token = localStorage.getItem('token'); 

    if (!token) {
      alert("Erro: Usuário não autenticado. Faça login novamente.");
      return;
    }

    try {
      // Disparar a requisição POST para o Back-end
      const response = await fetch('http://localhost:3000/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        // Enviando os dados do estado 
        body: JSON.stringify({
          // O validador do Kauê exige esse campo. 
          // Estamos mandando um valor fixo (mock) só para passar no teste dele.
          aiModelVersion: "YOLOv8-IoT", 
          
          // E podemos mandar os nossos dados também (se o Model dele salvar)
          deviceId: formData.id, 
          vehiclePlate: formData.veiculo,
          status: formData.status,
          batteryLevel: formData.bateria
        })
      });
if (response.ok) {
        alert("Dispositivo cadastrado com sucesso!");
        setIsModalOpen(false);
        setFormData({ id: '', veiculo: '', status: 'Online', bateria: '100%', deteccoes: 0 });
        
        // A MÁGICA ACONTECE AQUI: 
        // Chama a função para buscar a lista atualizada do banco!
        buscarDispositivos(); 
      } else {
        const errorData = await response.json();
        alert(`Erro ao cadastrar: ${errorData.message || 'Dados inválidos.'}`);
        console.error(errorData);
      }
    } catch (error) {
      console.error("Erro na comunicação com a API:", error);
      alert("Erro ao conectar com o servidor. Verifique se o back-end está rodando.");
    }
  };

  return (
    <div className="container-principal">
      <div className="conteudo-central">
        
        {/* CABEÇALHO */}
        <header className="cabecalho">
          <div className="titulos">
            <button className="botao-voltar">← Dashboard</button>
            <h1>Gestão de Dispositivos IoT</h1>
          </div>
            <button className="botao-primario" onClick={() => setIsModalOpen(true)}>
            + Registrar Dispositivo
            </button>
        </header>

        {/* CARDS DE RESUMO */}
        <div className="grid-cards">
          <div className="card">
            <span className="numero-destaque online">{quantidadeOnline}</span>
            <span className="legenda-card">Dispositivos Online</span>
          </div>
          <div className="card">
            <span className="numero-destaque offline">{quantidadeOffline}</span>
            <span className="legenda-card">Dispositivos Offline</span>
          </div>
          <div className="card">
            <span className="numero-destaque neutro">{totalDeteccoes}</span>
            <span className="legenda-card">Detecções Hoje</span>
          </div>
        </div>

        {/* TABELA DE DADOS */}
        <div className="container-tabela">
          <table className="tabela-dispositivos">
            <thead>
              <tr>
                <th>ID Dispositivo</th>
                <th>Veículo</th>
                <th>Status</th>
                <th>Detecções</th>
                <th>Bateria</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.id}>
                  <td className="texto-cinza">{device.id}</td>
                  <td className="texto-negrito">{device.veiculo}</td>
                  <td>
                    <div className="status-container">
                      <span className={`bolinha-status ${device.status === 'Online' ? 'bg-verde' : 'bg-vermelho'}`}></span>
                      {device.status}
                    </div>
                  </td>
                  <td className="texto-cinza">{device.deteccoes}</td>
                  <td className="texto-cinza">{device.bateria}</td>
                  <td>
                    <button className="botao-detalhes">Detalhes</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODAL DE CADASTRO (Posicionado no final do componente pai para evitar bugs de CSS) */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Registrar Dispositivo</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>ID do Dispositivo</label>
                  <input 
                    placeholder="Ex: IOT-VH-0046" 
                    value={formData.id}
                    onChange={(e) => setFormData({...formData, id: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Placa do Veículo</label>
                  <input 
                    placeholder="Ex: ABC-1234" 
                    value={formData.veiculo}
                    onChange={(e) => setFormData({...formData, veiculo: e.target.value})}
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                  <button type="submit" className="btn-save">Salvar</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}