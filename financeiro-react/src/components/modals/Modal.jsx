import React from 'react';
import { createPortal } from 'react-dom'; // <--- Importamos a ferramenta de teletransporte
import '../../assets/css/components.css'; // Ou './Modal.css' se você separou

export function Modal({ isOpen, onClose, titulo, children }) {
    if (!isOpen) return null;



    return createPortal(
        <div className="modal-overlay">
            {/* stopPropagation impede que clicar na caixa feche o modal */}
            <div className="adc-conteudo" onClick={(e) => e.stopPropagation()}>
                
                <span className="close-btn" onClick={onClose}>&times;</span>
                
                <div className="modal-header">
                    <h3>{titulo}</h3>
                </div>
                
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>,
        document.body 
    );
}