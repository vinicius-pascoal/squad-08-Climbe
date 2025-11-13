import { contratoRepo } from "../repositories/contrato.repo";
import { ContratoDTO } from "../dtos/contrato.dto";

export const contratoService = {
	async create(input: ContratoDTO) {
		console.log('🔧 Service - Criando contrato com dados:', input);

		try {
			const contrato = await contratoRepo.create({
				id: input.id,
				nome: input.nome,
				propostaId: input.propostaId || null,
				status: input.status || null,
				descricao: input.descricao || null,
				valor: Number(input.valor),
				dataInicio: new Date(input.dataInicio),
				dataFim: new Date(input.dataFim),
				envolvidos: input.envolvidos || null,
				acoes: input.acoes || null,
				permissoes: input.permissoes || null
			});
			console.log('✅ Service - Contrato criado:', contrato);
			return contrato;
		} catch (error) {
			console.error('❌ Service - Erro ao criar contrato:', error);
			throw error;
		}
	},

	async findAll() {
		return await contratoRepo.findAll();
	},

	async findById(id: string) {
		const contrato = await contratoRepo.findById(id);
		if (!contrato) {
			throw new Error("Contrato não encontrado");
		}
		return contrato;
	},

	async update(id: string, input: Partial<ContratoDTO>) {
		return await contratoRepo.update(id, { ...input });
	},

	async remove(id: string) {
		return await contratoRepo.remove(id);
	},
};
