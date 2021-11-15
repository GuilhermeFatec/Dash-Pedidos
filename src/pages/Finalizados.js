import React from "react";
import Container  from "react-bootstrap/Container";
import  Row  from "react-bootstrap/Row";
import  Col  from "react-bootstrap/Col";

import Cabecalho from '../components/Cabecalho'
import Rodape from '../components/Rodape'

const Finalizados = () =>{
    return(
        <Container fluid className="p-0">
        <Cabecalho />
        <Row>
            <Col xs={12} lg={6}>
                
            </Col>
            <Col></Col>
        </Row>
        <Rodape/>
    </Container>
    )
}

export default Finalizados