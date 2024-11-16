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

import com.financeiro.dto.DespesaDTO;
import com.financeiro.service.DespesaService;

@RestController
@RequestMapping("/despesa")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ControllerDespesa {
    
    @Autowired
    private DespesaService despesaService;

    @PostMapping
    public ResponseEntity<List<DespesaDTO>> adicionarDespesa(@RequestBody DespesaDTO despesaDTO) {
        return despesaService.adicionarDespesa(despesaDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DespesaDTO> buscarDespesaPorId(@PathVariable Long id) {
        return despesaService.buscarDespesaPorId(id);
    }

    @GetMapping("/conta/{idConta}")
    public ResponseEntity<List<DespesaDTO>> listarDespesasPorConta(@PathVariable Long idConta, @RequestParam Date dataInicial, @RequestParam Date dataFinal) {
        return despesaService.listarDespesasPorConta(idConta, dataInicial, dataFinal);
    }

    @GetMapping("/categoria/{idCategoria}")
    public ResponseEntity<List<DespesaDTO>> listarDespesasPorCategoria(@PathVariable Long idCategoria, @RequestParam Date dataInicial, @RequestParam Date dataFinal) {
        return despesaService.listarDespesasPorCategoria(idCategoria, dataInicial, dataFinal);
    }

    @GetMapping("/soma/{idConta}")
    public ResponseEntity<BigDecimal> somarDespesas(@PathVariable Long idConta, @RequestParam Date dataInicial, @RequestParam Date dataFinal) {
        return despesaService.somarDespesas(idConta, dataInicial, dataFinal);
    }

    @GetMapping("/soma/categoria/{idCategoria}")
    public ResponseEntity<BigDecimal> somarDespesasPorCategoria(@PathVariable Long idCategoria, @RequestParam Date dataInicial, @RequestParam Date dataFinal) {
        return despesaService.somarDespesasPorCategoria(idCategoria, dataInicial, dataFinal);
    }

    @PutMapping("/{id}")
    public ResponseEntity<List<DespesaDTO>> alterarDespesa(@PathVariable Long id, @RequestBody DespesaDTO despesaDTO) {
        return despesaService.alterarDespesa(id, despesaDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarDespesa(@PathVariable Long id) {
        return despesaService.deletarDespesa(id);
    }

}
