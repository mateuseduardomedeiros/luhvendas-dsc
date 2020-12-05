import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Cliente extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({name: 'nome'})
  nome?: string;

  @Column({ length: 14 }) //(84) 997063979
  telefone!: string;
}
