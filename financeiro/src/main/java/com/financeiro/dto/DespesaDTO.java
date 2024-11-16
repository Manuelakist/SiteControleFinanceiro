package com.financeiro.dto;

import java.math.BigDecimal;
import java.sql.Date;

public class DespesaDTO {

    private Long id;
    private String descricao;
    private String tipo;
    private BigDecimal valor;
    private int tempo;
    private Date data;
    private ContaDTO contaDTO;
    private CategoriaDespesaDTO categoriaDespesaDTO;
    
    public DespesaDTO() {
    }

    public DespesaDTO(Long id, String descricao, String tipo, BigDecimal valor, int tempo, Date data, ContaDTO contaDTO,
            CategoriaDespesaDTO categoriaDespesaDTO) {
        this.id = id;
        this.descricao = descricao;
        this.tipo = tipo;
        this.valor = valor;
        this.tempo = tempo;
        this.data = data;
        this.contaDTO = contaDTO;
        this.categoriaDespesaDTO = categoriaDespesaDTO;
    }

    public DespesaDTO(DespesaDTO despesaDTO) {
        this.id = despesaDTO.getId();
        this.descricao = despesaDTO.getDescricao();
        this.tipo = despesaDTO.getTipo();
        this.valor = despesaDTO.getValor();
        this.tempo = despesaDTO.getTempo();
        this.data = despesaDTO.getData();
        this.contaDTO = despesaDTO.getContaDTO();
        this.categoriaDespesaDTO = despesaDTO.getCategoriaDespesaDTO();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public int getTempo() {
        return tempo;
    }

    public void setTempo(int tempo) {
        this.tempo = tempo;
    }

    public Date getData() {
        return data;
    }

    public void setData(Date data) {
        this.data = data;
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
