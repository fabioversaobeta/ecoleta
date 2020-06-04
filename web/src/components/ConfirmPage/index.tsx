import React from 'react'
import { FiCheckCircle } from 'react-icons/fi'

import './styles.css'

const ConfirmPage = () => {
    return (
        <div id="full-page">
            <div className="elements">
                <FiCheckCircle className="imgConfirm"/>
                <p>Cadastro concluído!</p>
            </div>
        </div>        
    )
}

export default ConfirmPage
