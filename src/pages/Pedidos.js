import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/Table.css'
import Popup from "../components/Popup";
import Rodape from "../components/Rodape";
import Toast from 'react-bootstrap/Toast'
import Modal from 'react-bootstrap/Modal'
import Navbar from '../components/Navbar'


import { MdAdd, MdAssessment, MdCancel, MdDelete, MdModeEdit, MdSave } from 'react-icons/md'
import { BACKEND } from "../constants";
import Button from 'react-bootstrap/Button'
import { FormControl, FormGroup, FormLabel, FormSelect } from "react-bootstrap";



const Pedidos = () => {
    const valorInicial = { Numero: 1, Qnt: "", Descricao: "", Cliente: "", Empresa: "", Entrega: "", Valor: 1, Status: true }
    const [pedido, setPedido] = useState([valorInicial])
    const [show, setShow] = useState(false)
    const [pedidos, setPedidos] = useState([])
    const [carregandoPedidos, setCarregandoPedidos] = useState(false)
    const [erros, setErros] = useState({})
    const [aviso, setAviso] = useState('')
    const [SalvandoPedidos, setSalvandoPedidos] = useState(false)
    const [confirmaExclusao, setConfirmaExclusao] = useState(false)
    const { Numero, Descricao, Qnt, Cliente, Empresa, Entrega, Valor, Status } = pedido
    const [buttonPopup, setbuttonPopup] = useState(false)
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

    //Validação do Form
    const validaErrosPedido = () => {
        const novosErros = {}
        if (!Numero || Numero === "") novosErros.Numero = "O Número não pode estar vazio"
        else if (!Descricao || Descricao === "") novosErros.Descricao = "A Descrição não pode estar vazia"
        else if (!Qnt || Qnt === "") novosErros.Qnt = "A Quantidade não pode estar vazia"
        else if (!Cliente || Cliente === "") novosErros.Cliente = "O campo Cliente não pode estar vazio"
        else if (!Valor || Valor === "") novosErros.Valor = "O campo valor não pode estar vazio"
        else if (Empresa === "") novosErros.Empresa = "Selecione um centro de custo apropriado"
        else if (Entrega === "") novosErros.Entrega = "Selecione a data de entrega do pedido"
        else if (Status === true) novosErros.Status = "Selecione um Status válido"

        return novosErros
    }

    //Salvamento do pedido
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
            setShow(false)
        }
    }

    //Exclusão do pedido
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

    

    //Mostrar formulário ao clicar no botão adicionar
    function addregistro() {
        setPedido(valorInicial);
        setShow(true)
    }
    
    return (
        <Container fluid className="p-0">
            <Navbar />
            <Row>
                <Col xs={12}>
                    <div className="valorestotal"> Total de R$ {valorTotal.toLocaleString('pt-BR')} em {desenvolvimento.length} atividades &nbsp;&nbsp; 
                        <Button variant="success" title="Adicionar um registro"
                            onClick={() => {
                                addregistro()
                                setbuttonPopup(true)
                            }}
                        >
                            <><MdAdd />Add New</>
                        </Button>                                  
                    </div>
                    {/*Listagem de pedidos */}
                    {carregandoPedidos && <>
                        <Spinner animation="border" variant="primary" />
                        <p>Carregando pedidos!</p>
                    </>}
                    <Table striped bordered responsive className="tabelafim">
                        <thead>
                            <tr align="center">
                                <th class="numero" align="center">Número</th>
                                <th class="descricao" align="center">Descrição</th>
                                <th class="qnt" align="center">Qnt</th>
                                <th class="cliente" align="center">Cliente</th>
                                <th class="entrega" align="center">Entrega</th>
                                <th class="valor" align="center">Valor</th>
                                <th class="empresa" align="center">Empresa</th>
                                <th class="status" align="center">Status</th>
                                <th class="opcoes" align="center">Opções</th>
                            </tr>
                        </thead>
                        <tbody>
                            {desenvolvimento.map(item => (
                                <tr key={item._id}>
                                    <td align="center">{item.Numero}</td>
                                    <td align="start">{item.Descricao}</td>
                                    <td align="center">{item.Qnt}</td>
                                    <td align="center">{item.Cliente}</td>
                                    <td align="center">{new Date(item.Entrega).toLocaleDateString()}</td>
                                    <td align="center">R${(item.Valor).toLocaleString('pt-BR')}</td>
                                    <td align="center">{item.Empresa}</td>
                                    <td align="center">{item.Status}</td>
                                    <td className="Plmds" align="center">
                                        <Button variant="outline-primary" title="Editar o registro"
                                            onClick={() => {
                                                setShow(true)
                                                setPedido(item)
                                                setbuttonPopup(true)
                                            }}
                                        >
                                            <MdModeEdit />
                                        </Button>
                                        &nbsp;
                                        &nbsp;
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
                        </tbody>
                    </Table>
                </Col>
                <div className="divForm">
                    {show ?
                        <Col xs={12} lg={6} align="center" >
                            {/* Formulário para inserção de pedidos */}
                            <Popup trigger={buttonPopup}>
                                <h4 className="Cadastroh4"><MdAssessment />Cadastro de pedidos</h4>
                                &nbsp;
                                &nbsp;
                                &nbsp;
                                <form method="post" className="Formulario">
                                    <FormGroup as={Row} controlId="Numero">
                                        <Form.Label align="center" column sm={2}>
                                            Número
                                        </Form.Label>
                                        <Col sm={7}>
                                            <FormControl type="Number"
                                                name="Numero"
                                                /* placeholder="Ex: 1" */
                                                value={Numero}
                                                onChange={alteraDadosPedido}
                                                isInvalid={!!erros.Numero}
                                            />

                                            <FormControl.Feedback type='invalid'>
                                                {erros.Numero}
                                            </FormControl.Feedback>
                                        </Col>
                                    </FormGroup>
                                    &nbsp;
                                    <FormGroup as={Row} controlId="Descricao">
                                        <Form.Label align="center" column sm={2}>
                                            Descrição
                                        </Form.Label>
                                        <Col sm={7}>
                                            <FormControl
                                                name="Descricao"
                                                /* placeholder="Ex: Bomba" */
                                                value={Descricao}
                                                onChange={alteraDadosPedido}
                                                isInvalid={!!erros.Descricao}
                                            />

                                            <FormControl.Feedback type='invalid'>
                                                {erros.Descricao}
                                            </FormControl.Feedback>
                                        </Col>
                                    </FormGroup>
                                    &nbsp;
                                    <FormGroup as={Row} controlId="Qnt">
                                        <FormLabel align="center" column sm={2}>Quantidade</FormLabel>
                                        <Col sm={7}>
                                            <FormControl type="Number"
                                                name="Qnt"
                                                /* placeholder="Ex: 1" */
                                                value={Qnt}
                                                onChange={alteraDadosPedido}
                                                isInvalid={!!erros.Qnt}
                                            />

                                            <FormControl.Feedback type='invalid'>
                                                {erros.Qnt}
                                            </FormControl.Feedback>
                                        </Col>
                                    </FormGroup>

                                    &nbsp;
                                    <FormGroup as={Row} controlId="Cliente">
                                        <FormLabel align="center" column sm={2}>Cliente</FormLabel>
                                        <Col sm={7}>
                                            <FormControl
                                                name="Cliente"
                                                /* placeholder="Ex: SANASA" */
                                                value={Cliente}
                                                onChange={alteraDadosPedido}
                                                isInvalid={!!erros.Cliente}
                                            />

                                            <FormControl.Feedback type='invalid'>
                                                {erros.Cliente}
                                            </FormControl.Feedback>
                                        </Col>
                                    </FormGroup>
                                    &nbsp;
                                    <FormGroup as={Row} controlId="Entrega">
                                        <FormLabel align="center" column sm={2}>Entrega</FormLabel>
                                        <Col sm={7}>
                                            <FormControl size="sm" type="date"
                                                name="Entrega"
                                                /* placeholder="Ex: 2022/01/01" */
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
                                            <FormControl type="Number"
                                                name="Valor"
                                                value={Valor}
                                                onChange={alteraDadosPedido}
                                                isInvalid={!!erros.Valor}
                                            />

                                            <FormControl.Feedback type='invalid'>
                                                {erros.Valor}
                                            </FormControl.Feedback>
                                        </Col>
                                    </FormGroup>
                                    &nbsp;
                                    <FormGroup as={Row} controlId="Empresa">
                                        <FormLabel align="center" column sm={2}>Empresa</FormLabel>
                                        <Col sm={7}>
                                            <FormSelect name="Empresa" className="required" isInvalid={!!erros.Empresa}
                                                value={Empresa}
                                                onChange={alteraDadosPedido}
                                            >
                                                <option value="">Selecione a Empresa</option>
                                                <option value="Glass">Glass</option>
                                                <option value="Lamor">Lamor</option>
                                                <option value="Aquamec">Aquamec</option>
                                            </FormSelect>
                                            <FormControl.Feedback type="invalid">
                                                {erros.Empresa}
                                            </FormControl.Feedback>
                                        </Col>
                                    </FormGroup>
                                    &nbsp;
                                    <FormGroup as={Row} controlId="Status">
                                        <FormLabel align="center" column sm={2}>Status</FormLabel>
                                        <Col sm={7}>
                                            <FormSelect name="Status" className="required" isInvalid={!!erros.Status}

                                                value={Status}
                                                onChange={alteraDadosPedido}>
                                                <option value="true">Selecione o Status</option>
                                                <option value="Desenvolvimento">Desenvolvimento</option>
                                                <option value="Finalizado">Finalizado</option>
                                            </FormSelect>
                                            <FormControl.Feedback type="invalid">
                                                {erros.Status}
                                            </FormControl.Feedback>
                                        </Col>
                                    </FormGroup>
                                    &nbsp;
                                    <div>
                                        <Button id="BotaoSalvar" variant="primary" type="submit"
                                            onClick={(e) => {
                                                salvarPedido(e)

                                            }}
                                            title="Salvar o registro">
                                            {SalvandoPedidos
                                                ? <><Spinner animation="border" size="sm" /> Aguarde...</>
                                                : <><MdSave /> Salvar</>
                                            }
                                        </Button>
                                        &nbsp;
                                        &nbsp;
                                        <Button id="BotaoCancelar" variant="danger"
                                            onClick={() => setShow(false)}
                                            title="Fechar">
                                            <><MdCancel /> Fechar</>
                                        </Button>
                                    </div>
                                </form>
                            </Popup>
                        </Col> : null
                    }
                </div>

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
                onHide={() => setConfirmaExclusao(false)}>
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

