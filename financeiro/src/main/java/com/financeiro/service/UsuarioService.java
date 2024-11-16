package com.financeiro.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.financeiro.dto.UsuarioDTO;
import com.financeiro.entities.Usuario;
import com.financeiro.repository.UsuarioRepository;
import com.financeiro.util.UsuarioMapper;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public void setUsuarioRepository (UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public ResponseEntity<UsuarioDTO> cadastrarUsuario(UsuarioDTO usuarioDTO) {

        Usuario usuario = UsuarioMapper.paraEntity(usuarioDTO);
        Usuario usuarioSalvo = new Usuario();

        try {
            usuarioSalvo = usuarioRepository.save(usuario);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        usuarioDTO.setId(usuarioSalvo.getId());

        return ResponseEntity.ok(usuarioDTO);
    }

    public ResponseEntity<UsuarioDTO> buscarUsuarioPorId(Long id) {

        Optional<UsuarioDTO> usuarioDTO = UsuarioMapper.paraDtoOptional(usuarioRepository.findById(id));
        
        return usuarioDTO.map(usuario -> ResponseEntity.ok(usuario)).orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<UsuarioDTO> buscarUsuarioPorEmail(String email) {

        Optional<UsuarioDTO> usuarioDTO = UsuarioMapper.paraDtoOptional(usuarioRepository.findByEmail(email));

        return usuarioDTO.map(usuario -> ResponseEntity.ok(usuario)).orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<Void> deletarUsuario(Long id) {

        Optional<Usuario> usuario = usuarioRepository.findById(id);

        if (usuario.isPresent()) {
            usuarioRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }

    }

}
