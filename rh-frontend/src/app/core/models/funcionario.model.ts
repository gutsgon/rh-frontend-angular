import { Cargo } from './cargo.model';

export interface FuncionarioComCargo {
  id: number;
  nome: string;
  dataAdmissao: string;
  salario: number;
  status: boolean;
  cargo: Cargo;
}

export interface FuncionarioComCargoCreate {
  nome: string;
  dataAdmissao: string;
  salario: number;
  status: boolean;
  cargo: Cargo;
}

export interface FuncionarioComCargoUpdate {
  id: number;
  nome: string;
  dataAdmissao: string;
  salario: number;
  status: boolean;
  cargoAntigo: Cargo;
  cargoNovo: Cargo;
}

export interface FuncionarioDetalhes {
  nome: string;
  dataAdmissao: string;
  salario: number;
  status: boolean;
  cargos: Cargo[];
  ferias: { idFuncionario: number; dataInicio: string; dataFim: string }[];
}

export interface FuncionarioMediaSalario {
  salarioMedio: number;
}
