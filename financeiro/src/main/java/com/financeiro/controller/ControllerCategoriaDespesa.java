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

import com.financeiro.dto.CategoriaDespesaDTO;
import com.financeiro.service.CategoriaDespesaService;

@RestController
@RequestMapping("/categoriaDespesa")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ControllerCategoriaDespesa {

    @Autowired
    private CategoriaDespesaService categoriaDespesaService;

    @PostMapping
    public ResponseEntity<CategoriaDespesaDTO> adicionarCategoria(@RequestBody CategoriaDespesaDTO categoriaDespesaDTO) {
        return categoriaDespesaService.adicionarCategoria(categoriaDespesaDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaDespesaDTO> buscarCategoriaPorId(@PathVariable Long id) {
        return categoriaDespesaService.buscarCategoriaPorId(id);
    }

    @GetMapping
    public ResponseEntity<List<CategoriaDespesaDTO>> listarCategoriasPorConta(@RequestParam Long idConta) {
        return categoriaDespesaService.listarCategoriasPorConta(idConta);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCategoria(@PathVariable Long id) {
        return categoriaDespesaService.deletarCategoria(id);
    }
}
