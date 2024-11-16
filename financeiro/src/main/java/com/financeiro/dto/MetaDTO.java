package com.financeiro.dto;

import java.math.BigDecimal;
import java.sql.Date;

public class MetaDTO {

    private Long id;
    private String objetivo;
    private BigDecimal valor;
    private Date dataInicio;
    private Date dataFim;
    private ContaDTO contaDTO;

    public MetaDTO() {
    }

    public MetaDTO(Long id, String objetivo, BigDecimal valor, Date dataInicio, Date dataFim, ContaDTO contaDTO) {
        this.id = id;
        this.objetivo = objetivo;
        this.valor = valor;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.contaDTO = contaDTO;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getObjetivo() {
        return objetivo;
    }

    public void setObjetivo(String objetivo) {
        this.objetivo = objetivo;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public Date getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(Date dataInicio) {
        this.dataInicio = dataInicio;
    }

    public Date getDataFim() {
        return dataFim;
    }

    public void setDataFim(Date dataFim) {
        this.dataFim = dataFim;
    }

    public ContaDTO getContaDTO() {
        return contaDTO;
    }

    public void setContaDTO(ContaDTO contaDTO) {
        this.contaDTO = contaDTO;
    }
    
}
