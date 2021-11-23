import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Navbar from '../components/Navbar'
import '../components/Inicio.css'
import Rodape from '../components/Rodape'
import carregamento from '../img/aquamec.jpg'
import Imagem from '../img/imgcontainer.jpg'



const Inicio = () => {
    return (
        <Container fluid className="p-0" >
            <Navbar />
            <Row className="Linha">
                <div className="col-12 col-lg-6">
                    <div className="Imagem">
                        <a href="#/finalizados">
                            <img src={Imagem} alt='Container com logo da empresa AQUAMEC' />
                        </a>
                    </div>
                    <h3>Follow-up itens finalizados</h3>
                    <p>Acesse o módulo de Follow-up Pedidos Finalizados. </p>
                </div>
                <div className="col-12 col-lg-6">
                    <div className="Imagem">
                        <a href='#/pedidos'>
                            <img src={carregamento} alt='Logo Aquamec'></img>
                        </a>
                    </div>
                    <div className="Conteudo2">
                        <h3>Follow-up itens pendentes</h3>
                        <p>Acesse o módulo de Follow-up Pedidos Pendentes. </p>
                    </div>
                </div>
            </Row>
            <Rodape />
        </Container>
    )
}

export default Inicio