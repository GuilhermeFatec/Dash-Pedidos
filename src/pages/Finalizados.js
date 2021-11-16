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
import { MdAssessment, MdDelete, MdList, MdModeEdit } from 'react-icons/md'
import { FcList } from 'react-icons/fc'
import { BACKEND } from "../constants";
import Button from "@restart/ui/esm/Button";

const Finalizados = () => {
    const valorInicio = { nome: "", status: true }
    const [pedido, setPedido] = useState([])
    const [pedidos, setPedidos] = useState([])
    const [carregandoPedidos, setCarregandoPedidos] = useState(false)

    //Somando os valores totais dos pedidos.    
    const finalizado = pedidos.filter(f => f.Status === 'Finalizado')
    const valorTotal = finalizado.reduce((acc, p) => acc + p.Valor, 0)
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
    return (
        <Container fluid className="p-0">
            <Cabecalho />
            <Row>
                <Col xs={12} lg={12}>
                    {/* Formulário para inserção de pedidos */}
                    <h4><FcList />Listagem de pedidos finalizados.</h4>

                    {carregandoPedidos && <>
                        <Spinner animation="border" variant="primary" />
                        <p>Carregando pedidos!</p>
                    </>}


                    <Table striped bordered>
                        <thead>
                            <tr align="center" className="bg-warning text-dark">
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
                            {finalizado.map(item => (
                                <tr key={item._id}>
                                    <td>{item.Numero}</td>
                                    <td>{item.Descricao}</td>
                                    <td>{item.Cliente}</td>
                                    <td>{new Date(item.Entrega).toLocaleDateString()}</td>
                                    <td>{new Number(item.Valor).toLocaleString('pt-BR')}</td>
                                    <td>{item.Empresa}</td>
                                    <td>{item.Status}</td>

                                    <Button variant="outline-primary" className="btn-primary" title="Editar">
                                        <MdModeEdit />
                                    </Button>
                                    &nbsp;
                                    <Button variant="outline-danger" className="btn-danger" title="Apagar">
                                        <MdDelete />
                                    </Button>
                                </tr>
                            ))}


                            <tr className="bg-dark text-light">
                                <td>Total de pedidos: {finalizado.length} </td>
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

export default Finalizados