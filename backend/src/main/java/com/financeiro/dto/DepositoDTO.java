package com.financeiro.dto;

import java.math.BigDecimal;
import java.sql.Date;

public class DepositoDTO {

    private Long id;
    private BigDecimal valor;
    private Date data;
    private MetaDTO metaDTO;
    
    public DepositoDTO() {
    }

    public DepositoDTO(Long id, BigDecimal valor, Date data, MetaDTO metaDTO) {
        this.id = id;
        this.valor = valor;
        this.data = data;
        this.metaDTO = metaDTO;
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

    public Date getData() {
        return data;
    }

    public void setData(Date data) {
        this.data = data;
    }

    public MetaDTO getMetaDTO() {
        return metaDTO;
    }

    public void setMetaDTO(MetaDTO metaDTO) {
        this.metaDTO = metaDTO;
    }
    
}
