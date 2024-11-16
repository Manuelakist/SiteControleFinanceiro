package com.financeiro.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.financeiro.dto.CategoriaReceitaDTO;
import com.financeiro.entities.CategoriaReceita;
import com.financeiro.entities.Conta;
import com.financeiro.repository.CategoriaReceitaRepository;
import com.financeiro.repository.ContaRepository;
import com.financeiro.util.CategoriaReceitaMapper;
import com.financeiro.util.ContaMapper;

@Service
public class CategoriaReceitaService {

    @Autowired
    private CategoriaReceitaRepository crRepository;

    @Autowired
    private ContaRepository contaRepository;

    public ResponseEntity<CategoriaReceitaDTO> adicionarCategoria(CategoriaReceitaDTO categoriaDTO) {

        Conta conta = contaRepository.findById(categoriaDTO.getContaDTO().getId()).orElseThrow(() -> new RuntimeException("Conta não encontrada"));
        categoriaDTO.setContaDTO(ContaMapper.paraDTO(conta));
        CategoriaReceita categoria = CategoriaReceitaMapper.paraEntity(categoriaDTO);
        CategoriaReceita categoriaSalva = new CategoriaReceita();

        try {
            categoriaSalva = crRepository.save(categoria);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        categoriaDTO.setId(categoriaSalva.getId());

        return ResponseEntity.ok(categoriaDTO);
    }

    public ResponseEntity<CategoriaReceitaDTO> buscarCategoriaPorId(Long id) {

        Optional<CategoriaReceitaDTO> categoriaDTO = CategoriaReceitaMapper.paraDtoOptional(crRepository.findById(id));

        return categoriaDTO.map(categoria -> ResponseEntity.ok(categoria)).orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<List<CategoriaReceitaDTO>> listarCategoriasPorConta(Long idConta) {

        List<CategoriaReceita> categorias = crRepository.findByContaId(idConta);
        List<CategoriaReceitaDTO> categoriasDTO = categorias.stream().map(categoria -> CategoriaReceitaMapper.paraDTO(categoria)).collect(Collectors.toList());

        return ResponseEntity.ok(categoriasDTO);
    }

    public ResponseEntity<Void> deletarCategoria(Long id) {

        Optional<CategoriaReceita> categoria = crRepository.findById(id);

        if (categoria.isPresent()) {
            crRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
}
