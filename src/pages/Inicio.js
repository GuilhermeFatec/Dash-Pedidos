import React from "react";
import Container  from "react-bootstrap/Container";
import  Row  from "react-bootstrap/Row";
import  Col  from "react-bootstrap/Col";

import Cabecalho from '../components/Cabecalho'
import Rodape from '../components/Rodape'
const Inicio = () =>{
    return(
        <Container fluid className="p-0">
            <Cabecalho />
            <Row>
                <Col xs={12} lg={6}>
                    <h1>Bem vindo!</h1>
                    <p>Acesse os módulos para visualização de pedidos em desenvolvimento ou já finalizados através dos menus!</p>
                </Col>
                <Col></Col>
            </Row>
            <Rodape/>
        </Container>
    )
}

export default Inicio