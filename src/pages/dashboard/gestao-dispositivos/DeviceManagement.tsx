import React, { useState } from 'react';
import './DeviceManagement.css'; // Importando o nosso arquivo de estilos raiz

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
];

export default function DeviceManagement() {
  const [devices] = useState<Device[]>(mockDevices);

  return (
    <div className="container-principal">
      <div className="conteudo-central">
        
        {/* === 1. CABEÇALHO === */}
        <header className="cabecalho">
          <div className="titulos">
            <button className="botao-voltar">← Dashboard</button>
            <h1>Gestão de Dispositivos IoT</h1>
          </div>
          <button className="botao-primario">+ Registrar Dispositivo</button>
        </header>

        {/* === 2. CARDS DE RESUMO === */}
        <div className="grid-cards">
          <div className="card">
            <span className="numero-destaque online">12</span>
            <span className="legenda-card">Dispositivos Online</span>
          </div>
          <div className="card">
            <span className="numero-destaque offline">3</span>
            <span className="legenda-card">Dispositivos Offline</span>
          </div>
          <div className="card">
            <span className="numero-destaque neutro">1,892</span>
            <span className="legenda-card">Detecções Hoje</span>
          </div>
        </div>

        {/* === 3. TABELA DE DADOS === */}
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

      </div>
    </div>
  );
}