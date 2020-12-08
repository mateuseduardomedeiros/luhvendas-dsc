import { MigrationInterface, QueryRunner } from "typeorm";
import { Usuario } from "../models/Usuario";

export class initUsuarios1607050388312 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let usuarioEduardo: Usuario = new Usuario();
    usuarioEduardo.nome = "Eduardo";
    usuarioEduardo.login = "eduardo";
    usuarioEduardo.senha = "Mateuseduardo@2";
    usuarioEduardo.hashSenha()

    let usuarioGustavo: Usuario = new Usuario();
    usuarioGustavo.nome = "Gustavo";
    usuarioGustavo.login = "gustavo";
    usuarioGustavo.senha = "gustavo00";
    usuarioGustavo.hashSenha()

    let usuarioLuzia: Usuario = new Usuario();
    usuarioLuzia.nome = "Luzia";
    usuarioLuzia.login = "luzia";
    usuarioLuzia.senha = "luzia123";
    usuarioLuzia.hashSenha()

    await usuarioEduardo.save();
    await usuarioLuzia.save();
    await usuarioGustavo.save();
   
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
