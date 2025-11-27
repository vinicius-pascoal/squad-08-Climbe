import { usuarioRepo } from '../repositories/usuario.repo';
import { roles } from '../config/env';
import { RegisterDTO, AprovarDTO } from '../dtos/usuario.dto';
import { hashPassword } from '../utils/password';
import { prisma } from '../utils/prisma';
import { permissionService } from './permission.service';
import { sendTemplate } from './email.service';

const SITUACAO = { PENDENTE: 'pendente', APROVADO: 'aprovado', DESATIVADO: 'desativado' } as const;

export const usuarioService = {
  async register(input: RegisterDTO) {
    const exists = await usuarioRepo.findByEmail(input.email);
    if (exists) {
      const e: any = new Error('E-mail já cadastrado');
      e.statusCode = 409;
      throw e;
    }
    const senhaHash = await hashPassword(input.senha);
    const created = await usuarioRepo.create({
      nomeCompleto: input.nomeCompleto,
      cargoId: null,
      email: input.email.toLowerCase(),
      contato: input.contato ?? null,
      situacao: SITUACAO.PENDENTE,
      senhaHash,
    } as any);
    return created;
  },

  async aprovar(input: AprovarDTO) {
    const { id, cargoId } = input;
    const cargo = await prisma.cargo.findUnique({ where: { id: cargoId } });
    if (!cargo) {
      const e: any = new Error('Cargo inválido');
      e.statusCode = 400;
      throw e;
    }
    const user = await usuarioRepo.findById(id);
    if (!user) {
      const e: any = new Error('Usuário não encontrado');
      e.statusCode = 404;
      throw e;
    }
    const updated = await usuarioRepo.update(id, { situacao: SITUACAO.APROVADO, cargoId });

    try {
      await sendTemplate([updated.email], 'boas-vindas', { nome: updated.nomeCompleto, cargo: cargo.nomeCargo });
    } catch (err) {
      console.warn('Falha ao enviar e-mail de boas-vindas:', (err as Error).message);
    }
    // sincroniza permissoes do cargo para o usuario
    try { await permissionService.syncPermissionsForUserFromCargo(updated.id, cargoId); } catch (e) { console.warn('Falha ao sincronizar permissoes do cargo:', (e as Error).message); }
    return updated;
  },

  async adminCreate(input: any) {
    const { nomeCompleto, email, contato, senha, cargoId } = input;
    let situacao = String(input.situacao || 'pendente').toLowerCase();
    if (!['aprovado', 'pendente', 'desativado'].includes(situacao)) situacao = 'pendente';

    const exists = await usuarioRepo.findByEmail(email);
    if (exists) {
      const e: any = new Error('E-mail já cadastrado');
      e.statusCode = 409;
      throw e;
    }
    const cargo = await prisma.cargo.findUnique({ where: { id: cargoId } });
    if (!cargo) {
      const e: any = new Error('Cargo inválido');
      e.statusCode = 400;
      throw e;
    }
    const senhaHash = await hashPassword(senha);
    const created = await usuarioRepo.create({
      nomeCompleto,
      email: email.toLowerCase(),
      contato: contato ?? null,
      situacao,
      senhaHash,
      cargo: { connect: { id: cargoId } },
    } as any);

    // Se já for aprovado, dispara boas-vindas
    if (situacao === 'aprovado') {
      try {
        await sendTemplate([created.email], 'boas-vindas', { nome: created.nomeCompleto, cargo: cargo.nomeCargo });
      } catch (err) {
        console.warn('Falha ao enviar e-mail de boas-vindas:', (err as Error).message);
      }
      // sincroniza permissoes do cargo para o usuario (admin create)
      try { await permissionService.syncPermissionsForUserFromCargo(created.id, cargoId); } catch (e) { console.warn('Falha ao sincronizar permissoes do cargo (adminCreate):', (e as Error).message); }
    }
    return created;
  },

  // ⬇️ AQUI: filtra usuários com cargo Admin
  list: async () => {
    const adminCargoId = Number((roles as any)?.adminCargoId ?? 9);
    const users = await usuarioRepo.list();
    // mantém quem não tem cargo (null) e quem tem cargo diferente do Admin
    return users.filter((u: any) => Number(u.cargoId) !== adminCargoId);
  },

  async update(id: number, input: any) {
    const user = await usuarioRepo.findById(id);
    if (!user) {
      const e: any = new Error('Usuário não encontrado');
      e.statusCode = 404;
      throw e;
    }

    const updateData: any = {};

    if (input.nomeCompleto) updateData.nomeCompleto = input.nomeCompleto;
    if (input.email) {
      const emailExists = await usuarioRepo.findByEmail(input.email);
      if (emailExists && emailExists.id !== id) {
        const e: any = new Error('E-mail já cadastrado');
        e.statusCode = 409;
        throw e;
      }
      updateData.email = input.email.toLowerCase();
    }
    if (input.contato !== undefined) updateData.contato = input.contato;
    if (input.cargoId !== undefined) {
      if (input.cargoId !== null) {
        const cargo = await prisma.cargo.findUnique({ where: { id: input.cargoId } });
        if (!cargo) {
          const e: any = new Error('Cargo inválido');
          e.statusCode = 400;
          throw e;
        }
      }
      updateData.cargoId = input.cargoId;
    }
    if (input.situacao) updateData.situacao = input.situacao;
    if (input.senha) {
      updateData.senhaHash = await hashPassword(input.senha);
    }

    const updated = await usuarioRepo.update(id, updateData);

    // Se o cargo foi alterado, sincroniza permissões
    if (input.cargoId !== undefined && input.cargoId !== null) {
      try {
        await permissionService.syncPermissionsForUserFromCargo(id, input.cargoId);
      } catch (e) {
        console.warn('Falha ao sincronizar permissões:', (e as Error).message);
      }
    }

    return updated;
  },

  findById: (id: number) => usuarioRepo.findById(id),
  delete: (id: number) => usuarioRepo.delete(id),
};
