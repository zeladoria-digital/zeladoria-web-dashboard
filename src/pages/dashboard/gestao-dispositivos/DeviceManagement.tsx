import React, { useState } from 'react';
import './DeviceManagement.css';

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
  const [devices] = useState<Device[]>(mockDevices);

  // 1. A LÓGICA VEM AQUI (Antes do return)
  
  // Inspetor separando os online e contando
  const quantidadeOnline = devices.filter(device => device.status === 'Online').length;
  
  // Inspetor separando os offline e contando
  const quantidadeOffline = devices.filter(device => device.status === 'Offline').length;

  // BÔNUS: Para somar todas as detecções, usamos o .reduce()
  // Ele é como um inspetor com uma calculadora: o 'acc' (acumulador) começa em 0 e vai somando as detecções de cada dispositivo.
  const totalDeteccoes = devices.reduce((acc, device) => acc + device.deteccoes, 0);
  return (
    <div className="container-principal">
      <div className="conteudo-central">
        
        {/* CABEÇALHO */}
        <header className="cabecalho">
          <div className="titulos">
            <button className="botao-voltar">← Dashboard</button>
            <h1>Gestão de Dispositivos IoT</h1>
          </div>
          <button className="botao-primario">+ Registrar Dispositivo</button>
        </header>

{/* CARDS DE RESUMO */}
        <div className="grid-cards">
          <div className="card">
            {/* Trocamos o '12' pela variável */}
            <span className="numero-destaque online">{quantidadeOnline}</span>
            <span className="legenda-card">Dispositivos Online</span>
          </div>
          <div className="card">
            {/* Trocamos o '3' pela variável */}
            <span className="numero-destaque offline">{quantidadeOffline}</span>
            <span className="legenda-card">Dispositivos Offline</span>
          </div>
          <div className="card">
            {/* Trocamos o '1,892' pela variável */}
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

      </div>
    </div>
  );
}