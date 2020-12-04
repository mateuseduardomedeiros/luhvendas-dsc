import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";

@Entity()
@Unique(["telefone"])
export class Cliente extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome?: string;

  @Column({ length: 14 }) //(84) 997063979
  telefone!: string;
}
