import React, { useState } from "react";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import { MdHome, MdAssessment, MdTask} from 'react-icons/md'
import Pedidos from "../pages/Pedidos";

const Cabecalho = () =>{
   
    
    return(
    <Navbar bg="primary" variant="dark">
        <Navbar.Brand><MdAssessment/> Controle de pedidos</Navbar.Brand>
        <Nav className="mr-auto">
            <Nav.Link href="#/"><MdHome>Inicio</MdHome></Nav.Link>
            <Nav.Link href="#/pedidos"><MdAssessment>Pedidos</MdAssessment></Nav.Link>
            <Nav.Link href="#/finalizados"><MdTask>Finalizados</MdTask></Nav.Link>            
        </Nav>
        </Navbar>
        )
}
export default Cabecalho