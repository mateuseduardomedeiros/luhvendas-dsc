import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Compra extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({type: 'date'})
  data!: Date;

  @Column({ nullable: true })
  observacao?: string;

  @Column("float")
  valor!: number;
}
