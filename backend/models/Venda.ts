import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cliente } from "./Cliente";
import { TipoPagamento } from "./TipoPagamento";

@Entity()
export class Venda extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  data!: Date;

  @OneToOne((type) => Cliente)
  @JoinColumn()
  cliente!: Cliente;

  @Column()
  observacao?: string;

  @OneToOne((type) => TipoPagamento)
  @JoinColumn()
  tipoPagamento!: TipoPagamento;

  @Column()
  valorTotal!: number;

  @Column()
  valorPago?: number;
}
