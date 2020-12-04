import {MigrationInterface, QueryRunner} from "typeorm";
import { TipoPagamento } from "../models/TipoPagamento";

export class initTipoPagamento1607100102166 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        let dinheiro: TipoPagamento = new TipoPagamento();
        dinheiro.nome = 'Dinheiro';
        dinheiro.save();
        let credito: TipoPagamento = new TipoPagamento();
        credito.nome = 'Cartão de Crédito';
        credito.save();
        let debito: TipoPagamento = new TipoPagamento();
        debito.nome = 'Cartão de Débito';
        debito.save();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
