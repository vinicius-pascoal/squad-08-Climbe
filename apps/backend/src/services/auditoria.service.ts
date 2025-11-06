import { auditoriaRepository } from '../repositories/auditoria.repo';
import { CreateAuditoriaDto, AuditoriaQueryDto } from '../dtos/auditoria.dto';
import * as ExcelJS from 'exceljs';

export const auditoriaService = {
  async registrar(data: CreateAuditoriaDto) {
    return await auditoriaRepository.create(data);
  },

  async listar(query: AuditoriaQueryDto) {
    return await auditoriaRepository.findAll(query);
  },

  async buscarPorId(id: number) {
    const auditoria = await auditoriaRepository.findById(id);
    if (!auditoria) {
      throw new Error('Registro de auditoria não encontrado');
    }
    return auditoria;
  },

  async buscarPorEntidade(entidade: string, entidadeId?: number) {
    return await auditoriaRepository.findByEntidade(entidade, entidadeId);
  },

  async exportarExcel(query: AuditoriaQueryDto) {
    // Buscar todos os registros sem paginação para o export
    const queryCompleta = { ...query, limit: 10000 };
    const { registros } = await auditoriaRepository.findAll(queryCompleta);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Auditoria');

    // Configurar cabeçalhos
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Data/Hora', key: 'dataCriacao', width: 20 },
      { header: 'Usuário', key: 'usuario', width: 30 },
      { header: 'Ação', key: 'acao', width: 20 },
      { header: 'Entidade', key: 'entidade', width: 15 },
      { header: 'ID Entidade', key: 'entidadeId', width: 12 },
      { header: 'Descrição', key: 'descricao', width: 40 },
      { header: 'IP', key: 'ip', width: 15 },
      { header: 'User Agent', key: 'userAgent', width: 30 },
    ];

    // Estilizar cabeçalho
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' },
    };
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Adicionar dados
    registros.forEach((registro) => {
      worksheet.addRow({
        id: registro.id,
        dataCriacao: new Date(registro.dataCriacao).toLocaleString('pt-BR'),
        usuario: registro.usuario?.nome || 'Sistema',
        acao: registro.acao,
        entidade: registro.entidade,
        entidadeId: registro.entidadeId || '',
        descricao: registro.descricao || '',
        ip: registro.ip || '',
        userAgent: registro.userAgent || '',
      });
    });

    // Aplicar bordas
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    return workbook;
  },

  async exportarCSV(query: AuditoriaQueryDto) {
    const queryCompleta = { ...query, limit: 10000 };
    const { registros } = await auditoriaRepository.findAll(queryCompleta);

    const headers = [
      'ID',
      'Data/Hora',
      'Usuário',
      'Ação',
      'Entidade',
      'ID Entidade',
      'Descrição',
      'IP',
      'User Agent',
    ];

    const rows = registros.map((registro) => [
      registro.id,
      new Date(registro.dataCriacao).toLocaleString('pt-BR'),
      registro.usuario?.nome || 'Sistema',
      registro.acao,
      registro.entidade,
      registro.entidadeId || '',
      registro.descricao?.replace(/"/g, '""') || '',
      registro.ip || '',
      registro.userAgent?.replace(/"/g, '""') || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${cell}"`).join(',')
      ),
    ].join('\n');

    return csvContent;
  },
};
