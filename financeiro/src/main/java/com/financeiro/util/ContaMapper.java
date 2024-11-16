package com.financeiro.util;

import java.util.Optional;

import com.financeiro.dto.ContaDTO;
import com.financeiro.dto.UsuarioDTO;
import com.financeiro.entities.Conta;
import com.financeiro.entities.Usuario;

public class ContaMapper {
    
    public static ContaDTO paraDTO(Conta conta) {

        UsuarioDTO usuarioDTO = new UsuarioDTO();
        usuarioDTO.setId(conta.getUsuario().getId());
        usuarioDTO.setNome(conta.getUsuario().getNome());
        usuarioDTO.setEmail(conta.getUsuario().getEmail());
        usuarioDTO.setSenha(conta.getUsuario().getSenha());

        ContaDTO contaDTO = new ContaDTO();
        contaDTO.setId(conta.getId());
        contaDTO.setTitulo(conta.getTitulo());
        contaDTO.setSaldo(conta.getSaldo());   
        contaDTO.setUsuarioDTO(usuarioDTO);     

        return contaDTO;
    }

    public static Conta paraEntity(ContaDTO contaDTO) {

        Usuario usuario = new Usuario();
        usuario.setId(contaDTO.getUsuarioDTO().getId());
        usuario.setNome(contaDTO.getUsuarioDTO().getNome());
        usuario.setEmail(contaDTO.getUsuarioDTO().getEmail());
        usuario.setSenha(contaDTO.getUsuarioDTO().getSenha());

        Conta conta = new Conta();
        conta.setId(contaDTO.getId());
        conta.setTitulo(contaDTO.getTitulo());
        conta.setSaldo(contaDTO.getSaldo());
        conta.setUsuario(usuario);

        return conta;
    }

    public static Optional<ContaDTO> paraDtoOptional(Optional<Conta> contaRecebida) {
        Optional<ContaDTO> contaDTO = contaRecebida.map(conta -> new ContaDTO(conta.getId(), conta.getTitulo(), conta.getSaldo(), UsuarioMapper.paraDTO(conta.getUsuario())));

        return contaDTO;
    }

}   
