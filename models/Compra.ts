import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Compra extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  data!: Date;

  @Column()
  observacao?: string;

  @Column()
  valor!: number;
}
