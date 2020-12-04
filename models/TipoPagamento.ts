import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";


@Entity()
export class TipoPagamento extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;
}
