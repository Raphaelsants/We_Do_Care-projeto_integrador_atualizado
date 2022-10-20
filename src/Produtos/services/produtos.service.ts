import { InjectRepository} from "@nestjs/typeorm";
import { Repository, ILike, DeleteResult, ReturningStatementNotSupportedError } from "typeorm";
import { Produto } from "../entities/produtos.entitie";
import { Injectable, HttpException, HttpStatus } from "@nestjs/common";


@Injectable()
export class ProdutosService {    
    constructor(@InjectRepository(Produto)
    private produtosRepository: Repository<Produto>){}

    //Metodo para achar todos.
    async findAll(): Promise<Produto[]> {
        return await this.produtosRepository.find()
}
    //Método achar pelo ID
    async findById(id: number): Promise<Produto>{
        let produtos = await this.produtosRepository.findOne({
            where:{
                id
            }
        });
        if (!produtos){
            throw new HttpException('Id referido não existe',HttpStatus.NOT_FOUND)
        }
        return produtos;
    }

    //Método de achar pelo nome
    async findbyName(nome: string): Promise<Produto[]>{
        return await this.produtosRepository.find({
            where:{
                nome:ILike(`%${nome}%`)
            }
        })
    }
    //Método de criar dados no banco de dados
    async create(produtos: Produto): Promise<Produto>{
        return await this.produtosRepository.save(produtos);
    }
    //Método de atualizar dados no banco de dados pelo ID
    async update(produtos: Produto): Promise<Produto>{
        let buscarProdutos: Produto = await this.findById(produtos.id);
        if (!buscarProdutos || !produtos.id){
            throw new HttpException('Id referido não existe.', HttpStatus.NOT_FOUND);
        }
        return await this.produtosRepository.save(produtos);
    }

    //Método de deletar dados do banco de dados pelo id
    async delete(id:number): Promise<DeleteResult>{
        let buscarProduto:Produto = await this.findById(id)
        if (!buscarProduto){
            throw new HttpException('Id referido não existe.', HttpStatus.NOT_FOUND)
        }
        return await this.produtosRepository.delete(id)
    }
}