package com.financeiro.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.financeiro.dto.UsuarioDTO;
import com.financeiro.entities.Usuario;
import com.financeiro.repository.UsuarioRepository;
import com.financeiro.util.UsuarioMapper;

/**
 * Serviço responsável por gerir a lógica de negócio da entidade Usuario.
 */
@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public void setUsuarioRepository(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * Efetua o registo de um novo utilizador.
     * Valida previamente se o endereço de email já se encontra registado na base de dados.
     * * @param usuarioDTO Dados do utilizador a registar.
     * @return ResponseEntity contendo o DTO atualizado ou status de conflito.
     */
    public ResponseEntity<UsuarioDTO> cadastrarUsuario(UsuarioDTO usuarioDTO) {

        Optional<Usuario> usuarioExistente = usuarioRepository.findByEmail(usuarioDTO.getEmail());

        if (usuarioExistente.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        Usuario usuario = UsuarioMapper.paraEntity(usuarioDTO);
        Usuario usuarioSalvo;

        try {
            usuarioSalvo = usuarioRepository.save(usuario);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        usuarioDTO.setId(usuarioSalvo.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioDTO);
    }

    /**
     * Recupera os dados de um utilizador pelo seu identificador único.
     * * @param id Identificador do utilizador.
     * @return ResponseEntity com os dados do utilizador ou status não encontrado.
     */
    public ResponseEntity<UsuarioDTO> buscarUsuarioPorId(Long id) {

        Optional<UsuarioDTO> usuarioDTO = UsuarioMapper.paraDtoOptional(usuarioRepository.findById(id));

        return usuarioDTO.map(usuario -> ResponseEntity.ok(usuario)).orElse(ResponseEntity.notFound().build());
    }

    /**
     * Recupera os dados de um utilizador utilizando o seu endereço de email.
     * * @param email Endereço de email do utilizador.
     * @return ResponseEntity com os dados do utilizador ou status não encontrado.
     */
    public ResponseEntity<UsuarioDTO> buscarUsuarioPorEmail(String email) {

        Optional<UsuarioDTO> usuarioDTO = UsuarioMapper.paraDtoOptional(usuarioRepository.findByEmail(email));

        return usuarioDTO.map(usuario -> ResponseEntity.ok(usuario)).orElse(ResponseEntity.notFound().build());
    }

    /**
     * Remove o registo de um utilizador do sistema.
     * * @param id Identificador do utilizador.
     * @return ResponseEntity com status de sucesso ou não encontrado.
     */
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