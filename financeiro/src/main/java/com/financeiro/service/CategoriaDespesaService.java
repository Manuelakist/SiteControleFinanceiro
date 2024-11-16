package com.financeiro.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.financeiro.dto.CategoriaDespesaDTO;
import com.financeiro.entities.CategoriaDespesa;
import com.financeiro.entities.Conta;
import com.financeiro.repository.CategoriaDespesaRepository;
import com.financeiro.repository.ContaRepository;
import com.financeiro.util.CategoriaDespesaMapper;
import com.financeiro.util.ContaMapper;

@Service
public class CategoriaDespesaService {

    @Autowired
    private CategoriaDespesaRepository cdRepository;

    @Autowired
    private ContaRepository contaRepository;

    public ResponseEntity<CategoriaDespesaDTO> adicionarCategoria(CategoriaDespesaDTO categoriaDTO) {

        Conta conta = contaRepository.findById(categoriaDTO.getContaDTO().getId()).orElseThrow(() -> new RuntimeException("Conta não encontrada"));
        categoriaDTO.setContaDTO(ContaMapper.paraDTO(conta));
        CategoriaDespesa categoria = CategoriaDespesaMapper.paraEntity(categoriaDTO);
        CategoriaDespesa categoriaSalva = new CategoriaDespesa();

        try {
            categoriaSalva = cdRepository.save(categoria);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        categoriaDTO.setId(categoriaSalva.getId());

        return ResponseEntity.ok(categoriaDTO);
    }

    public ResponseEntity<CategoriaDespesaDTO> buscarCategoriaPorId(Long id) {

        Optional<CategoriaDespesaDTO> categoriaDTO = CategoriaDespesaMapper.paraDtoOptional(cdRepository.findById(id));

        return categoriaDTO.map(categoria -> ResponseEntity.ok(categoria)).orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<List<CategoriaDespesaDTO>> listarCategoriasPorConta(Long idConta) {

        List<CategoriaDespesa> categorias = cdRepository.findByContaId(idConta);
        List<CategoriaDespesaDTO> categoriasDTO = categorias.stream().map(categoria -> CategoriaDespesaMapper.paraDTO(categoria)).collect(Collectors.toList());

        return ResponseEntity.ok(categoriasDTO);
    }

    public ResponseEntity<Void> deletarCategoria(Long id) {

        Optional<CategoriaDespesa> categoria = cdRepository.findById(id);

        if (categoria.isPresent()) {
            cdRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
}
