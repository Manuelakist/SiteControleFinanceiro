package com.financeiro.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.financeiro.dto.CategoriaReceitaDTO;
import com.financeiro.service.CategoriaReceitaService;

@RestController
@RequestMapping("/categoriaReceita")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ControllerCategoriaReceita {

    @Autowired
    private CategoriaReceitaService categoriaReceitaService;

     @PostMapping
    public ResponseEntity<CategoriaReceitaDTO> adicionarCategoria(@RequestBody CategoriaReceitaDTO categoriaReceitaDTO) {
        return categoriaReceitaService.adicionarCategoria(categoriaReceitaDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaReceitaDTO> buscarCategoriaPorId(@PathVariable Long id) {
        return categoriaReceitaService.buscarCategoriaPorId(id);
    }

    @GetMapping
    public ResponseEntity<List<CategoriaReceitaDTO>> listarCategoriasPorConta(@RequestParam Long idConta) {
        return categoriaReceitaService.listarCategoriasPorConta(idConta);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCategoria(@PathVariable Long id) {
        return categoriaReceitaService.deletarCategoria(id);
    }
    
}
