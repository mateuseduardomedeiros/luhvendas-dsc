import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cliente } from "./Cliente";
import { TipoPagamento } from "./TipoPagamento";

@Entity()
export class Venda extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "date" })
  data!: Date;

  @ManyToOne(() => Cliente, { onDelete: "CASCADE", eager: true })
  @JoinColumn()
  cliente!: Cliente;

  @Column()
  observacao?: string;

  @ManyToOne(() => TipoPagamento, { onDelete: "SET NULL", eager: true })
  @JoinColumn()
  tipoPagamento!: TipoPagamento;

  @Column("float", {default: 0})
  valorTotal!: number;

  @Column("float", {default: 0})
  valorPago!: number;
}
