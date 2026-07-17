export type FeriasStatus = 'Pendente' | 'Em andamento' | 'Concluídas';

export interface Ferias {
  id: number;
  idFuncionario: number;
  dataInicio: string;
  dataFim: string;
  status: FeriasStatus;
}

export interface FeriasCreate {
  idFuncionario: number;
  dataInicio: string;
  dataFim: string;
}

export interface FeriasUpdate {
  id: number;
  idFuncionario: number;
  dataInicio: string;
  dataFim: string;
}
