package com.financeiro.util;

import java.util.Optional;

import com.financeiro.dto.UsuarioDTO;
import com.financeiro.entities.Usuario;

public class UsuarioMapper {
    
    public static UsuarioDTO paraDTO(Usuario usuario) {

        UsuarioDTO usuarioDTO = new UsuarioDTO();
        usuarioDTO.setId(usuario.getId());
        usuarioDTO.setNome(usuario.getNome());
        usuarioDTO.setEmail(usuario.getEmail());
        usuarioDTO.setSenha(usuario.getSenha());

        return usuarioDTO;
    }

    public static Usuario paraEntity(UsuarioDTO usuarioDTO) {

        Usuario usuario = new Usuario();
        usuario.setId(usuarioDTO.getId());
        usuario.setNome(usuarioDTO.getNome());
        usuario.setEmail(usuarioDTO.getEmail());
        usuario.setSenha(usuarioDTO.getSenha());

        return usuario;
    }
    
    public static Optional<UsuarioDTO> paraDtoOptional(Optional<Usuario> usuarioRecebido) {

        Optional<UsuarioDTO> usuarioDTO = usuarioRecebido.map(usuario -> new UsuarioDTO(usuario.getId(), usuario.getNome(),
                             usuario.getEmail(), usuario.getSenha()));

        return usuarioDTO;
    }


}
