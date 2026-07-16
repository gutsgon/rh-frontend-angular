export interface HistoricoAlteracao {
  id: number;
  idFuncionario: number;
  idCargo: number;
  idFerias: number;
  dataAlteracao: string;
  campoAlterado: string;
  valorAntigo: string;
  valorNovo: string;
}
