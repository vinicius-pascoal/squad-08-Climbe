-- script seed.sql para adicionar cargos iniciais no banco de dados

-- Cargos iniciais
INSERT IGNORE INTO `cargos` (`nome_cargo`)
VALUES
    ('Compliance'),
    ('CEO'),
    ('Membro do Conselho'),
    ('CSO'),
    ('CMO'),
    ('CFO'),
    ('Analista de Valores Imobiliários'),
    ('Analista de BPO Financeiro');
