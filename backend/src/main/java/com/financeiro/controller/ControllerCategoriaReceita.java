package com.financeiro.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.financeiro.dto.CategoriaReceitaDTO;
import com.financeiro.service.CategoriaReceitaService;

/**
 * Controlador REST para gestão de categorias de receita.
 * Ajustado para o mapeamento '/categoria-receita' conforme requisitado pelo front-end.
 */
@RestController
@RequestMapping("/categoria-receita")
public class ControllerCategoriaReceita {

    @Autowired
    private CategoriaReceitaService service;

    @PostMapping
    public ResponseEntity<CategoriaReceitaDTO> adicionar(@RequestBody CategoriaReceitaDTO dto) {
        return service.adicionarCategoria(dto);
    }

    @GetMapping("/conta/{idConta}")
    public ResponseEntity<List<CategoriaReceitaDTO>> listarPorConta(@PathVariable Long idConta) {
        return service.listarCategoriasPorConta(idConta);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaReceitaDTO> buscarPorId(@PathVariable Long id) {
        return service.buscarCategoriaPorId(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return service.deletarCategoria(id);
    }
}