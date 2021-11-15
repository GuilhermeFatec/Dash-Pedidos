import React from "react";
import { Navbar, NavbarBrand } from "react-bootstrap";

import {MdAssessment} from 'react-icons/md'

const Rodape = () =>{
    return(
        <Navbar bg="dark" fixed="bottom">
            <Navbar.Brand className="text-light">
                <MdAssessment/> aQuamec &copy; - Todos os direitos reservados
            </Navbar.Brand>

        </Navbar>
    )
}

export default Rodape