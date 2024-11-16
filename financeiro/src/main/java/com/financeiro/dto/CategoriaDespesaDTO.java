package com.financeiro.dto;

public class CategoriaDespesaDTO {

    private Long id;
    private String nome;
    private ContaDTO contaDTO;

    public CategoriaDespesaDTO() {
    }

    public CategoriaDespesaDTO(Long id, String nome, ContaDTO contaDTO) {
        this.id = id;
        this.nome = nome;
        this.contaDTO = contaDTO;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public ContaDTO getContaDTO() {
        return contaDTO;
    }

    public void setContaDTO(ContaDTO contaDTO) {
        this.contaDTO = contaDTO;
    }
    
}
