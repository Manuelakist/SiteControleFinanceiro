package com.financeiro.dto;

import java.math.BigDecimal;

public class ContaDTO {

    private Long id;
    private String titulo;
    private BigDecimal saldo;
    private UsuarioDTO usuarioDTO;

    public ContaDTO() {
    }

    public ContaDTO(Long id, String titulo, BigDecimal saldo, UsuarioDTO usuarioDTO) {
        this.id = id;
        this.titulo = titulo;
        this.saldo = saldo;
        this.usuarioDTO = usuarioDTO;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public BigDecimal getSaldo() {
        return saldo;
    }

    public void setSaldo(BigDecimal saldo) {
        this.saldo = saldo;
    }

    public UsuarioDTO getUsuarioDTO() {
        return usuarioDTO;
    }

    public void setUsuarioDTO(UsuarioDTO usuarioDTO) {
        this.usuarioDTO = usuarioDTO;
    }
    
}
