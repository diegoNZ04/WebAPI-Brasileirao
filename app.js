import tabela2024 from "./tabela.js";
import express from 'express';
import { modeloTime, modeloAtualizacaoTime } from "./validation.js";

const app = express();

app.use(express.json()); // considerar o corpo das requisições como json

app.get('/', (requisicao, resposta) => {
    resposta.status(200).send(tabela2024); // enviar informação de tabela
}); 

app.get('/:sigla', (requisicao, resposta) => {
    const siglaInformada = requisicao.params.sigla.toUpperCase(); // acessar sigla por requisição
    const time = tabela2024.find((infoTime) => infoTime.sigla === siglaInformada); // procurar a sigla
    if (!time /* time === undefined */) { // undefined -> se comporta como falso toda vez que exigimos comportamento de boolean
        //boolean -> se a variavel time for "undefined", entãi ela vai se comportar como false
        // false -> Consequentemente, !time vai se comportar como verdadeiro.
        resposta.status(404).send('Não existe na série A do Brasileirão um time com a sigla informada!'); // 404 == não encontrado
        return;
    }
    resposta.status(200).send(time); // entregar informação da sigla
});

app.put('/:sigla', (req, res) => {
    const siglaInformada = req.params.sigla.toUpperCase();
    const timeSelecionado = tabela2024.find((t) => t.sigla === siglaInformada);
    if (!timeSelecionado) {
        res.status(404).send('Não existe na série A do Brasileirão um time com a sigla informada!')
        return;
    }
    const { error } = modeloAtualizacaoTime.validate(req.body); // validação de erros
    if(error) {
        res.status(400).send(error);
        return;
    }
    const campos = Object.keys(req.body); // gerar array com todas as chaves
    for (let campo of campos) {
        timeSelecionado[campo] = req.body[campo] // usando campos vindo da requisição para atualizar campos dentro do objeto
    }

    res.status(200).send(timeSelecionado);
});

app.post('/', (req, res) => {
    const novoTime = req.body;
    const { error } = modeloTime.validate(novoTime);
    if(error) {
        res.status(400).send(error);
        return;
    }
    tabela2024.push(novoTime);
    res.status(201).send(novoTime);
});

app.delete('/:sigla', (req, res) => {
    const siglaInformada = req.params.sigla.toUpperCase();
    const indiceTimeSelecionado = tabela2024.findIndex(
        (t) => t.sigla === siglaInformada
    ); // achar o indice do elemento que compartilha as respectivas caracteristicas
    if (indiceTimeSelecionado === -1) {
        res.status(404).send('Não existe na série A do Brasileirão um time com a sigla informada!')
        return;
    }
    const timeRemovido = tabela2024.splice(indiceTimeSelecionado, 1
    ); // splice -> remover elementos de um array

    res.status(200).send(timeRemovido);
});

app.listen(300, () => console.log('servidor rodando com sucesso')); // definir porta 



