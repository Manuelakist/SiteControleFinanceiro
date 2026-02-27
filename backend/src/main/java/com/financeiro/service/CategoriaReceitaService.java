package com.financeiro.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.financeiro.dto.CategoriaReceitaDTO;
import com.financeiro.entities.CategoriaReceita;
import com.financeiro.entities.Conta;
import com.financeiro.repository.CategoriaReceitaRepository;
import com.financeiro.repository.ContaRepository;
import com.financeiro.util.CategoriaReceitaMapper;

/**
 * Serviço de gestão de categorias de receita.
 * Refatorado para evitar referências circulares na serialização JSON.
 */
@Service
public class CategoriaReceitaService {

    @Autowired
    private CategoriaReceitaRepository crRepository;

    @Autowired
    private ContaRepository contaRepository;

    public ResponseEntity<CategoriaReceitaDTO> adicionarCategoria(CategoriaReceitaDTO categoriaDTO) {
        try {
            if (categoriaDTO.getContaDTO() == null || categoriaDTO.getContaDTO().getId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }

            Conta conta = contaRepository.findById(categoriaDTO.getContaDTO().getId())
                    .orElseThrow(() -> new RuntimeException("Conta não encontrada."));

            CategoriaReceita categoria = new CategoriaReceita();
            categoria.setNome(categoriaDTO.getNome());
            categoria.setConta(conta);

            CategoriaReceita categoriaSalva = crRepository.save(categoria);

            CategoriaReceitaDTO respostaDTO = new CategoriaReceitaDTO();
            respostaDTO.setId(categoriaSalva.getId());
            respostaDTO.setNome(categoriaSalva.getNome());

            return ResponseEntity.status(HttpStatus.CREATED).body(respostaDTO);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<CategoriaReceitaDTO> buscarCategoriaPorId(Long id) {
        Optional<CategoriaReceitaDTO> categoriaDTO = CategoriaReceitaMapper.paraDtoOptional(crRepository.findById(id));
        return categoriaDTO.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<List<CategoriaReceitaDTO>> listarCategoriasPorConta(Long idConta) {
        List<CategoriaReceita> categorias = crRepository.findByContaId(idConta);
        List<CategoriaReceitaDTO> categoriasDTO = categorias.stream()
                .map(CategoriaReceitaMapper::paraDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(categoriasDTO);
    }

    public ResponseEntity<Void> deletarCategoria(Long id) {
        if (crRepository.existsById(id)) {
            crRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}