import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Pedidos.css'
import Toast from 'react-bootstrap/Toast'
import Modal from 'react-bootstrap/Modal'


import Cabecalho from '../components/Cabecalho'
import Rodape from '../components/Rodape'
import { MdAssessment, MdDelete, MdList, MdModeEdit, MdSave } from 'react-icons/md'
import { FcList } from 'react-icons/fc'
import { BACKEND } from "../constants";
import Button from 'react-bootstrap/Button'
import { FormControl, FormGroup, FormLabel, FormSelect } from "react-bootstrap";

const Pedidos = () => {
    const valorInicial = { Numero: 1, Qnt: "", Descricao: "", Cliente: "", Empresa: "", Entrega: "", Valor: 1, Status: true }
    const [pedido, setPedido] = useState([valorInicial])
    const [pedidos, setPedidos] = useState([])
    const [carregandoPedidos, setCarregandoPedidos] = useState(false)
    const [erros, setErros] = useState({})
    const [aviso, setAviso] = useState('')
    const [SalvandoPedidos, setSalvandoPedidos] = useState(false)
    const [confirmaExclusao, setConfirmaExclusao] = useState(false)
    const { Numero, Descricao, Qnt, Cliente, Empresa, Entrega, Valor, Status } = pedido


    //Somando os valores totais dos pedidos em desenvolvimento.    
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
        //Validação do Numero
        if (!Numero || Numero === "") novosErros.Numero = "O Número não pode estar vazio"
        else if (!Descricao || Descricao === "") novosErros.Descricao = "A Descrição não pode estar vazia"
        else if (!Qnt || Qnt === "") novosErros.Qnt = "A Quantidade não pode estar vazia"
        else if (!Cliente || Cliente === "") novosErros.Cliente = "O campo Cliente não pode estar vazio"
        else if (!Valor || Valor === "") novosErros.Valor = "O campo valor não pode estar vazio"

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
                    console.error(`Erro ao salvar a categoria: ${error.message}`)
                })
            setSalvandoPedidos(false)
        }
    }

     async function excluirPedido(){
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
                <Col>
                    {/*Listagem de pedidos */}
                    <h4><FcList />Listagem de pedidos em carga.</h4>
                    {carregandoPedidos && <>
                        <Spinner animation="border" variant="primary" />
                        <p>Carregando pedidos!</p>
                    </>}


                    <Table striped bordered >
                        <thead>
                            <tr align="center" className="bg-warning text-dark">
                                <th align="center">Número</th>
                                <th align="center">Descrição</th>
                                <th align="center">Qnt</th>
                                <th align="center">Cliente</th>
                                <th align="center">Data de Entrega</th>
                                <th align="center">Valor</th>
                                <th align="center">Empresa</th>
                                <th align="center">Status</th>
                                <th align="center">Opções</th>
                            </tr>
                        </thead>
                        <tbody>
                            {desenvolvimento.map(item => (
                                <tr key={item._id}>
                                    <td align="left">{item.Numero}</td>
                                    <td align="left">{item.Descricao}</td>
                                    <td align="left">{item.Qnt}</td>
                                    <td align="left">{item.Cliente}</td>
                                    <td align="left">{new Date(item.Entrega).toLocaleDateString('ja')}</td>
                                    <td align="left">{new Number(item.Valor).toLocaleString('pt-BR')}</td>
                                    <td align="left">{item.Empresa}</td>
                                    <td align="left">{item.Status}</td>
                                    <td>
                                        <Button variant="outline-primary" title="Editar o registro"
                                            onClick={() => setPedido(item)}

                                        >
                                            <MdModeEdit />
                                        </Button>
                                        &nbsp;
                                        <Button variant="outline-danger" title="Apagar o registro"
                                        onClick={() => {
                                            setConfirmaExclusao(true)
                                            setPedido(item)
                                        }}
                                        >
                                            <MdDelete />
                                        </Button>

                                    </td>
                                </tr>
                            ))}

                            <tr className="bg-dark text-light">
                                <td colSpan="3" align="center">Total de pedidos: {desenvolvimento.length} </td>
                                <td colSpan="3" align="right">Valor total: R$ {valorTotal.toLocaleString('pt-BR')}</td>

                            </tr>

                        </tbody>
                    </Table>

                </Col>
                <Col xs={12} lg={6}>
                    {/* Formulário para inserção de pedidos */}
                    <h4><MdAssessment />Cadastro de pedidos</h4>
                    <form method="post">
                        <FormGroup as={Row} controlId="Numero">
                            <Form.Label align="center" column sm={2}>
                                Numero
                            </Form.Label>
                            <Col sm={7}>
                                <FormControl
                                    name="Numero"
                                    placeholder="Ex: 1"
                                    value={Numero}
                                    onChange={alteraDadosPedido}
                                    isInvalid={!!erros.Numero}
                                />
                            </Col>
                            <FormControl.Feedback type='invalid'>
                                {erros.Numero}
                            </FormControl.Feedback>
                        </FormGroup>
                        &nbsp;
                        <FormGroup as={Row} controlId="Descricao">
                            <Form.Label align="center" column sm={2}>
                                Descrição
                            </Form.Label>
                            <Col sm={7}>
                                <FormControl
                                    name="Descricao"
                                    placeholder="Ex: Bomba"
                                    value={Descricao}
                                    onChange={alteraDadosPedido}
                                    isInvalid={!!erros.Descricao}
                                />
                            </Col>
                            <FormControl.Feedback type='invalid'>
                                {erros.Descricao}
                            </FormControl.Feedback>
                        </FormGroup>
                        &nbsp;
                        <FormGroup as={Row} controlId="Qnt">
                            <FormLabel align="center" column sm={2}>Quantidade</FormLabel>
                            <Col sm={7}>
                                <FormControl
                                    name="Qnt"
                                    placeholder="Ex: 1"
                                    value={Qnt}
                                    onChange={alteraDadosPedido}
                                    isInvalid={!!erros.Qnt}
                                />
                            </Col>
                            <FormControl.Feedback type='invalid'>
                                {erros.Qnt}
                            </FormControl.Feedback>
                        </FormGroup>

                        &nbsp;
                        <FormGroup as={Row} controlId="Cliente">
                            <FormLabel align="center" column sm={2}>Cliente</FormLabel>
                            <Col sm={7}>
                                <FormControl
                                    name="Cliente"
                                    placeholder="Ex: SANASA"
                                    value={Cliente}
                                    onChange={alteraDadosPedido}
                                    isInvalid={!!erros.Cliente}
                                />
                            </Col>
                            <FormControl.Feedback type='invalid'>
                                {erros.Cliente}
                            </FormControl.Feedback>
                        </FormGroup>

                        &nbsp;

                        <FormGroup as={Row} controlId="Entrega">
                            <FormLabel align="center" column sm={2}>Data de entrega</FormLabel>
                            <Col sm={7}>
                                <FormControl
                                    name="Entrega"
                                    placeholder="Ex:"
                                    value={Entrega}
                                    onChange={alteraDadosPedido}
                                    isInvalid={!!erros.Entrega}
                                />
                            </Col>
                        </FormGroup>
                        &nbsp;
                        <FormGroup as={Row} controlId="Valor">
                            <FormLabel align="center" column sm={2}>Valor</FormLabel>
                            <Col sm={7}>
                                <FormControl
                                    name="Valor"
                                    value={Valor}
                                    onChange={alteraDadosPedido}
                                    isInvalid={!!erros.Valor}
                                />
                            </Col>
                            <FormControl.Feedback type='invalid'>
                                {erros.Valor}
                            </FormControl.Feedback>
                        </FormGroup>
                        &nbsp;
                        <FormGroup as={Row} controlId="Empresa">
                            <FormLabel align="center" column sm={2}>Empresa</FormLabel>
                            <Col sm={7}>
                                <FormSelect name="Empresa"
                                    value={Empresa}
                                    onChange={alteraDadosPedido}  >
                                    <option>Selecione a empresa</option>
                                    <option value="Glass">Glass</option>
                                    <option value="Lamor">Lamor</option>
                                    <option value="Aquamec">Aquamec</option>
                                </FormSelect>
                            </Col>
                        </FormGroup>
                        &nbsp;
                        <FormGroup as={Row} controlId="Status">
                            <FormLabel align="center" column sm={2}>Status</FormLabel>
                            <Col sm={7}>
                                <FormSelect name="Status"
                                    value={Status}
                                    onChange={alteraDadosPedido}  >
                                    <option>Selecione o Status</option>
                                    <option value="Desenvolvimento">Desenvolvimento</option>
                                    <option value="Finalizado">Finalizado</option>
                                </FormSelect>
                            </Col>
                        </FormGroup>

                        <Button variant="primary" type="submit"
                            onClick={(e) => salvarPedido(e)}
                            title="Salvar o registro">
                            {SalvandoPedidos
                                ? <><Spinner animation="border" size="sm" /> Aguarde...</>
                                : <><MdSave /> Salvar</>
                            }
                        </Button>
                    </form>
                </Col>
            </Row>
            <Toast
                onClose={() => setAviso('')}
                show={aviso.length > 0}
                animation={false}
                delay={4000}
                autohide
                className="bg-success"
                style={{
                    position: 'absolute',
                    top: 10,
                    right: 10
                }}>
                <Toast.Header closeButton={false}>Aviso</Toast.Header>
                <Toast.Body>{aviso}</Toast.Body>
            </Toast>
            <Modal animation={false} show={confirmaExclusao}
            onHide={()=> setConfirmaExclusao(false)}>
                <Modal.Header>
                    <Modal.Title>Confirmação da Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Confirma a exclusão do pedido selecionado?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setConfirmaExclusao(!confirmaExclusao)}>
                    ❌Cancelar
                    </Button>
                    <Button variant="success"
                    onClick={() => {
                        excluirPedido()
                        setConfirmaExclusao(!confirmaExclusao)
                    }}>
                    ✅Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Rodape />
        </Container>
    )
}

export default Pedidos

