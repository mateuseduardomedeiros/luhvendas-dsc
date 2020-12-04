import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";

import * as bcrypt from "bcryptjs";

@Entity()
@Unique(["login"])
export class Usuario extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 32 })
  nome!: string;

  @Column({ length: 32 })
  login!: string;

  @Column()
    senha!: string;

  hashSenha(){
      this.senha = bcrypt.hashSync(this.senha, 8);
  }
  checkSenha(senha: string) {
      return bcrypt.compareSync(senha, this.senha);
  }
}
