package com.financeiro.controller;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.financeiro.dto.ReceitaDTO;
import com.financeiro.service.ReceitaService;

@RestController
@RequestMapping("/receita")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ControllerReceita {

    @Autowired
    private ReceitaService receitaService;

    @PostMapping
    public ResponseEntity<List<ReceitaDTO>> adicionarReceita(@RequestBody ReceitaDTO receitaDTO) {
        return receitaService.adicionarReceita(receitaDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReceitaDTO> buscarReceitaPorId(@PathVariable Long id) {
        return receitaService.buscarReceitaPorId(id);
    }

    @GetMapping("/conta/{idConta}")
    public ResponseEntity<List<ReceitaDTO>> listarReceitasPorConta(@PathVariable Long idConta, @RequestParam Date dataInicial, @RequestParam Date dataFinal) {
        return receitaService.listarReceitasPorConta(idConta, dataInicial, dataFinal);
    }

    @GetMapping("/categoria/{idCategoria}")
    public ResponseEntity<List<ReceitaDTO>> listarReceitasPorCategoria(@PathVariable Long idCategoria, @RequestParam Date dataInicial, @RequestParam Date dataFinal) {
        return receitaService.listarReceitasPorCategoria(idCategoria, dataInicial, dataFinal);
    }

    @GetMapping("/soma/{idConta}")
    public ResponseEntity<BigDecimal> somarReceitas(@PathVariable Long idConta, @RequestParam Date dataInicial, @RequestParam Date dataFinal) {
        return receitaService.somarReceitas(idConta, dataInicial, dataFinal);
    }

    @GetMapping("/soma/categoria/{idConta}")
    public ResponseEntity<BigDecimal> somarReceitasPorCategoria(@PathVariable Long idConta, @RequestParam long idCategoria, @RequestParam Date dataInicial, @RequestParam Date dataFinal) {
        return receitaService.somarReceitasPorCategoria(idConta, idCategoria, dataInicial, dataFinal);
    }

    @PutMapping("/{id}")
    public ResponseEntity<List<ReceitaDTO>> alterarReceita(@PathVariable Long id, @RequestBody ReceitaDTO receitaDTO) {
        return receitaService.alterarReceita(id, receitaDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarReceita(@PathVariable Long id) {
        return receitaService.deletarReceita(id);
    }
    
}