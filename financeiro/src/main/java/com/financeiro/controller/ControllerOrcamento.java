package com.financeiro.controller;

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

import com.financeiro.dto.OrcamentoDTO;
import com.financeiro.service.OrcamentoService;

@RestController
@RequestMapping("/orcamento")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ControllerOrcamento {
    
    @Autowired
    private OrcamentoService orcamentoService;

    @PostMapping
    public ResponseEntity<OrcamentoDTO> adicionarOrcamento(@RequestBody OrcamentoDTO orcamentoDTO) {
        return orcamentoService.adicionarOrcamento(orcamentoDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrcamentoDTO> buscarOrcamentoPorId(@PathVariable Long id) {
        return orcamentoService.buscarOrcamentoPorId(id);
    }

    @GetMapping
    public ResponseEntity<List<OrcamentoDTO>> listarOrcamentosPorConta(@RequestParam Long idConta) {
        return orcamentoService.listarOrcamentosPorConta(idConta);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrcamentoDTO> alterarOrcamento(@PathVariable Long id, @RequestBody OrcamentoDTO orcamentoDTO) {
        return orcamentoService.alterarOrcamento(id, orcamentoDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarOrcamento(@PathVariable Long id) {
        return orcamentoService.deletarOrcamento(id);
    }

}
