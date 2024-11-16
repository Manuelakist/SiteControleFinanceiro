package com.financeiro.dto;

import java.math.BigDecimal;

public class OrcamentoDTO {

    private Long id;
    private BigDecimal valor;
    private ContaDTO contaDTO;
    private CategoriaDespesaDTO categoriaDespesaDTO;
    
    public OrcamentoDTO() {
    }

    public OrcamentoDTO(Long id, BigDecimal valor, ContaDTO contaDTO, CategoriaDespesaDTO categoriaDespesaDTO) {
        this.id = id;
        this.valor = valor;
        this.contaDTO = contaDTO;
        this.categoriaDespesaDTO = categoriaDespesaDTO;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public ContaDTO getContaDTO() {
        return contaDTO;
    }

    public void setContaDTO(ContaDTO contaDTO) {
        this.contaDTO = contaDTO;
    }

    public CategoriaDespesaDTO getCategoriaDespesaDTO() {
        return categoriaDespesaDTO;
    }

    public void setCategoriaDespesaDTO(CategoriaDespesaDTO categoriaDespesaDTO) {
        this.categoriaDespesaDTO = categoriaDespesaDTO;
    }
    
}
