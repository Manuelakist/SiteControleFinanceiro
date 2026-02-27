package com.financeiro.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.financeiro.dto.CategoriaDespesaDTO;
import com.financeiro.entities.CategoriaDespesa;
import com.financeiro.entities.Conta;
import com.financeiro.repository.CategoriaDespesaRepository;
import com.financeiro.repository.ContaRepository;
import com.financeiro.util.CategoriaDespesaMapper;

/**
 * Serviço de gestão de categorias de despesa.
 * Refatorado para evitar referências circulares na serialização JSON.
 */
@Service
public class CategoriaDespesaService {

    @Autowired
    private CategoriaDespesaRepository cdRepository;

    @Autowired
    private ContaRepository contaRepository;

    public ResponseEntity<CategoriaDespesaDTO> adicionarCategoria(CategoriaDespesaDTO categoriaDTO) {
        try {
            if (categoriaDTO.getContaDTO() == null || categoriaDTO.getContaDTO().getId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }

            Conta conta = contaRepository.findById(categoriaDTO.getContaDTO().getId())
                    .orElseThrow(() -> new RuntimeException("Conta não encontrada."));

            CategoriaDespesa categoria = new CategoriaDespesa();
            categoria.setNome(categoriaDTO.getNome());
            categoria.setConta(conta);

            CategoriaDespesa categoriaSalva = cdRepository.save(categoria);

            // Criação de um DTO limpo (sem associação bidirecional de Conta) para a resposta
            CategoriaDespesaDTO respostaDTO = new CategoriaDespesaDTO();
            respostaDTO.setId(categoriaSalva.getId());
            respostaDTO.setNome(categoriaSalva.getNome());

            return ResponseEntity.status(HttpStatus.CREATED).body(respostaDTO);

        } catch (Exception e) {
            e.printStackTrace(); // Facilita a depuração na consola do Spring Boot
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<CategoriaDespesaDTO> buscarCategoriaPorId(Long id) {
        Optional<CategoriaDespesaDTO> categoriaDTO = CategoriaDespesaMapper.paraDtoOptional(cdRepository.findById(id));
        return categoriaDTO.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<List<CategoriaDespesaDTO>> listarCategoriasPorConta(Long idConta) {
        List<CategoriaDespesa> categorias = cdRepository.findByContaId(idConta);
        List<CategoriaDespesaDTO> categoriasDTO = categorias.stream()
                .map(CategoriaDespesaMapper::paraDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(categoriasDTO);
    }

    public ResponseEntity<Void> deletarCategoria(Long id) {
        if (cdRepository.existsById(id)) {
            cdRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}