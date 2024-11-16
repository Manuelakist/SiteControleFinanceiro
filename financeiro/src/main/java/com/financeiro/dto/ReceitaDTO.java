package com.financeiro.dto;

import java.math.BigDecimal;
import java.sql.Date;

public class ReceitaDTO {

    private Long id;
    private String descricao;
    private String tipo;
    private BigDecimal valor;
    private int tempo;
    private Date data;
    private ContaDTO contaDTO;
    private CategoriaReceitaDTO categoriaReceitaDTO;
    
    public ReceitaDTO() {
    }

    public ReceitaDTO(Long id, String descricao, String tipo, BigDecimal valor, int tempo, Date data, ContaDTO contaDTO,
            CategoriaReceitaDTO categoriaReceitaDTO) {
        this.id = id;
        this.descricao = descricao;
        this.tipo = tipo;
        this.valor = valor;
        this.tempo = tempo;
        this.data = data;
        this.contaDTO = contaDTO;
        this.categoriaReceitaDTO = categoriaReceitaDTO;
    }

    public ReceitaDTO(ReceitaDTO receitaDTO) {
        this.id = receitaDTO.getId();
        this.descricao = receitaDTO.getDescricao();
        this.tipo = receitaDTO.getTipo();
        this.valor = receitaDTO.getValor();
        this.tempo = receitaDTO.getTempo();
        this.data = receitaDTO.getData();
        this.contaDTO = receitaDTO.getContaDTO();
        this.categoriaReceitaDTO = receitaDTO.getCategoriaReceitaDTO();
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

    public CategoriaReceitaDTO getCategoriaReceitaDTO() {
        return categoriaReceitaDTO;
    }

    public void setCategoriaReceitaDTO(CategoriaReceitaDTO categoriaReceitaDTO) {
        this.categoriaReceitaDTO = categoriaReceitaDTO;
    }
    
}
