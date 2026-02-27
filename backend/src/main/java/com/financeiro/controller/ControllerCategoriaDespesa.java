package com.financeiro.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.financeiro.dto.CategoriaDespesaDTO;
import com.financeiro.service.CategoriaDespesaService;

/**
 * Controlador REST para gestão de categorias de despesa.
 * Sincronizado com os métodos definidos em CategoriaDespesaService.
 */
@RestController
@RequestMapping("/categoria-despesa")
@CrossOrigin(origins = "*")
public class ControllerCategoriaDespesa {

    @Autowired
    private CategoriaDespesaService service;

    @PostMapping
    public ResponseEntity<CategoriaDespesaDTO> adicionar(@RequestBody CategoriaDespesaDTO dto) {
        return service.adicionarCategoria(dto);
    }

    @GetMapping("/conta/{idConta}")
    public ResponseEntity<List<CategoriaDespesaDTO>> listarPorConta(@PathVariable Long idConta) {
        return service.listarCategoriasPorConta(idConta);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaDespesaDTO> buscarPorId(@PathVariable Long id) {
        return service.buscarCategoriaPorId(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return service.deletarCategoria(id);
    }
}