package com.financeiro.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.financeiro.dto.ContaDTO;
import com.financeiro.entities.Conta;
import com.financeiro.entities.Usuario;
import com.financeiro.repository.ContaRepository;
import com.financeiro.repository.UsuarioRepository;
import com.financeiro.util.ContaMapper;
import com.financeiro.util.UsuarioMapper;

@Service
public class ContaService {

    @Autowired
    private ContaRepository contaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public ResponseEntity<ContaDTO> adicionarConta(ContaDTO contaDTO) {

        Usuario usuario = usuarioRepository.findById(contaDTO.getUsuarioDTO().getId()).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        contaDTO.setUsuarioDTO(UsuarioMapper.paraDTO(usuario));
        Conta conta = ContaMapper.paraEntity(contaDTO);
        Conta contaSalva = new Conta();

        try {
            contaSalva = contaRepository.save(conta);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        contaDTO.setId(contaSalva.getId());

        return ResponseEntity.ok(contaDTO);
    }

    public ResponseEntity<ContaDTO> buscarContaPorId(Long id) {
        Optional<ContaDTO> contaDTO = ContaMapper.paraDtoOptional(contaRepository.findById(id));

        return contaDTO.map(conta -> ResponseEntity.ok(conta)).orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<List<ContaDTO>> listarContasPorUsuario(Long idUsuario) {

        List<Conta> contas = contaRepository.findByUsuarioId(idUsuario);
        List<ContaDTO> contasDTO = contas.stream().map(conta -> ContaMapper.paraDTO(conta)).collect(Collectors.toList());

        return ResponseEntity.ok(contasDTO);
    }

    public ResponseEntity<ContaDTO> alterarConta(Long id, ContaDTO contaDTO) {
        ContaDTO contaAlterada = contaRepository.findById(id).map(conta -> {
            Usuario usuario = usuarioRepository.findById(contaDTO.getUsuarioDTO().getId()).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            conta.setTitulo(contaDTO.getTitulo());
            conta.setSaldo(contaDTO.getSaldo());
            conta.setUsuario(usuario);
            contaRepository.save(conta);
            return ContaMapper.paraDTO(conta);
        }).orElseThrow(() -> new RuntimeException("Conta não encontrada"));

        return ResponseEntity.ok(contaAlterada);
    }

    public ResponseEntity<Void> deletarConta(Long id) {

        Optional<Conta> conta = contaRepository.findById(id);

        if (conta.isPresent()) {
            contaRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }

    }
    
}
