import { contratoRepo } from "../repositories/contrato.repo";
import { ContratoDTO } from "../dtos/contrato.dto";

export const contratoService = {
	async create(input: ContratoDTO) {
		const contrato = await contratoRepo.create({
		  id: input.id,
		  nome: input.nome,
		  propostaId: input.propostaId,
		  status: input.status ?? '',
		  descricao: input.descricao ?? '',
		  valor: input.valor ?? '',
		  dataInicio: input.dataInicio,
		  dataFim: input.dataFim,
		  envolvidos: input.envolvidos ?? '',
		  acoes: input.acoes ?? '',
		  permissoes: input.permissoes ?? ''
		});
		return contrato;
	},

	async findById(id: string) {
		const contrato = await contratoRepo.findById(id);
		if (!contrato) {
			throw new Error("Contrato não encontrado");
		}
		return contrato;
	},

	async update(id: string, input: Partial<ContratoDTO>) {
		return await contratoRepo.update(id, {...input});
	},

	async remove(id: string) {
		return await contratoRepo.remove(id);
	},
};