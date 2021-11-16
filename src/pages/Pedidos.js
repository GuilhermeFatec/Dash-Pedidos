import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import 'bootstrap/dist/css/bootstrap.min.css';

import Cabecalho from '../components/Cabecalho'
import Rodape from '../components/Rodape'
import { MdAssessment, MdDelete, MdList, MdModeEdit, MdOutlineMoveToInbox, MdSave } from 'react-icons/md'
import { FcList } from 'react-icons/fc'
import { BACKEND } from "../constants";
import Button from "@restart/ui/esm/Button";
import { FormControl, FormGroup, FormLabel, FormSelect } from "react-bootstrap";

const Pedidos = () => {
    const valorInicial = { Numero: "", Descricao: "", Empresa: "", Entrega: "", Valor: "", Status: true }
    const [pedido, setPedido] = useState([valorInicial])
    const [pedidos, setPedidos] = useState([])
    const [carregandoPedidos, setCarregandoPedidos] = useState(false)
    const [erros, setErros] = useState({})
    const [aviso, setAviso] = useState('')
    const [salvandoCategorias, setSalvandoPedidos] = useState(false)
    const [confirmaExclusao, setConfirmaExclusao] = useState(false)
    const { Numero, Descricao, Cliente, Empresa, Entrega, Valor, Status } = pedido


    //Somando os valores totais dos pedidos.    
    const desenvolvimento = pedidos.filter(d => d.Status === 'Desenvolvimento')
    const valorTotal = desenvolvimento.reduce((acc, p) => acc + p.Valor, 0)
    async function obterPedidos() {
        setCarregandoPedidos(true)
        let url = `${BACKEND}/pedidos`
        await fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setPedidos(data)
            })
            .catch(function (error) {
                console.error("Erro ao obter os pedidos: " + error.message)
            })
        setCarregandoPedidos(false)
    }
    useEffect(() => {
        obterPedidos()
        document.title = "Pedidos em carga"
    }, [])

    const validaErrosPedido = () => {
        const novosErros = {}
        //Validação do nome
        if (Numero === '') novosErros.Numero = 'O Numero não pode ser vazio!'
        else if (Numero === !Number) novosErros.Numero = "O campo deve ser númerico"
        return novosErros
    }

    async function salvarPedido(event) {
        event.preventDefault() // evita que a página seja recarregada
        const novosErros = validaErrosPedido()
        if (Object.keys(novosErros).length > 0) {
            //Sim, temos erros!
            setErros(novosErros)
        } else {
            setSalvandoPedidos(true)
            const metodo = pedido.hasOwnProperty('_id') ? 'PUT' : 'POST'
            pedido.status = (pedido.status === true || pedido.status === 'Desenvolvimento') ? 'Desenvolvimento' : 'Finalizado'
            let url = `${BACKEND}/pedidos`
            await fetch(url, {
                method: metodo,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pedido)
            }).then(response => response.json())
                .then(data => {
                    (data._id || data.message) ? setAviso('Registro salvo com sucesso') : setAviso('')
                    setPedido(valorInicial) //limpar a tela com os valores iniciais
                    obterPedidos() //Atualizar a tela com os registros atualizados
                }).catch(function (error) {
                    console.error(`Erro ao salvar o pedido: ${error.message}`)
                })
            setSalvandoPedidos(false)
        }
    }

    async function excluirPedido() {
        let url = `${BACKEND}/pedidos/${pedido._id}`
        await fetch(url, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(data => {
                data.message ? setAviso(data.message) : setAviso('')
                obterPedidos()
            })
            .catch(function (error) {
                console.error(`Erro ao excluir o pedido: ${error.message}`)
            })
    }

    const alteraDadosPedido = e => {
        setPedido({ ...pedido, [e.target.name]: e.target.value })
        setErros({})
    }

    return (

        <Container fluid className="p-0">
            <Cabecalho />
            <Row>
                <Col xs={12} lg={6}>
                    {/*Listagem de pedidos */}
                    <h4><MdAssessment />Cadastro de pedidos</h4>
                    <form method="post">
                        <Form.Group controlId="numero">
                            <FormLabel>Número do pedido</FormLabel>
                            <FormControl
                                name="numero"
                                placeholder="Ex: 1"
                                value={Numero}
                                onChange={alteraDadosPedido}
                                isInvalid={!!erros.Numero}
                            />
                            <Form.Control.Feedback type="invalid">
                                {erros.Numero}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <FormGroup controlId="descricao">
                            <FormLabel>Descrição</FormLabel>
                            <FormControl
                                name="Descrição"
                                placeholder="Ex: Bomba"
                                value={Descricao}
                                onChange={alteraDadosPedido}
                                isInvalid={erros.Descricao}
                            />
                            <Form.Control.Feedback type="invalid">
                                {erros.Descricao}
                            </Form.Control.Feedback>
                        </FormGroup>

                        <FormGroup controlId="cliente">
                            <FormLabel>Cliente</FormLabel>
                            <FormControl
                                name="Cliente"
                                placeholder="Ex: SANASA"
                                value={Cliente}
                                onChange={alteraDadosPedido}
                                isInvalid={erros.Cliente}
                            />
                            <Form.Control.Feedback type="invalid">
                                {erros.Cliente}
                            </Form.Control.Feedback>
                        </FormGroup>

                        <FormGroup controlId="entrega">
                            <FormLabel>Data de entrega</FormLabel>
                           
                            
                        </FormGroup>

                        <FormGroup controlId="Empresa">
                            <FormLabel>Empresa</FormLabel>
                            <FormSelect name="empresa"
                                value={Empresa}
                                onChange={alteraDadosPedido}>
                                <option selected>Selecione a Empresa</option>
                                <option value="Aquamec">Aquamec</option>
                                <option value="Lamor">Lamor</option>
                                <option value="Glass">Glass</option>
                            </FormSelect>
                        </FormGroup>

                        <Button variant="primary" className="btn-primary" type="submit"
                            onClick={(e) => salvarPedido(e)}
                            title="Salvar o registro">
                            {salvandoCategorias
                                ? <><Spinner animation="border" size="sm" /> Aguarde...</>
                                : <><MdSave /> Salvar</>
                            }
                        </Button>
                    </form>
                </Col>
                <Col>
                    {/* Formulário para inserção de pedidos */}
                    <h4><FcList />Listagem de pedidos em carga.</h4>
                    {carregandoPedidos && <>
                        <Spinner animation="border" variant="primary" />
                        <p>Carregando categorias!</p>
                    </>}


                    <Table striped bordered >
                        <thead>
                            <tr className="bg-warning text-dark">
                                <th>Número</th>
                                <th>Descrição</th>
                                <th>Cliente</th>
                                <th>Data de Entrega</th>
                                <th>Valor</th>
                                <th>Empresa</th>
                                <th>Status</th>
                                <th>Opções</th>
                            </tr>
                        </thead>
                        <tbody>
                            {desenvolvimento.map(item => (
                                <tr key={item._id}>
                                    <td>{item.Numero}</td>
                                    <td>{item.Descricao}</td>
                                    <td>{item.Cliente}</td>
                                    <td>{new Date(item.Entrega).toLocaleDateString()}</td>
                                    <td>{new Number(item.Valor).toLocaleString('pt-BR')}</td>
                                    <td>{item.Empresa}</td>
                                    <td>{item.Status}</td>

                                    <button class="btn btn-primary" title="Editar"
                                        onClick={() => setPedido(item)}>
                                        <MdModeEdit />
                                    </button>

                                    &nbsp;
                                    <Button variant="outline-danger" className="btn-danger" title="Apagar"
                                        onClick={() => {
                                            setConfirmaExclusao(true)
                                            setPedido(item)
                                        }}>
                                        <MdDelete />
                                    </Button>
                                    &nbsp;
                                    <Button variant="outline-primary" className="btn-primary" title="Mover">
                                        <MdOutlineMoveToInbox />
                                    </Button>
                                </tr>
                            ))}

                            <tr className="bg-dark text-light">
                                <td>Total de pedidos: {desenvolvimento.length} </td>
                                <td>Valor: R$ {valorTotal.toLocaleString('pt-BR')}</td>

                            </tr>

                        </tbody>
                    </Table>

                </Col>
            </Row>
            <Rodape />
        </Container>
    )
}

export default Pedidos

