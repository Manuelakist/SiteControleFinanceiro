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

import com.financeiro.dto.ContaDTO;
import com.financeiro.service.ContaService;

@RestController
@RequestMapping("/conta")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ControllerConta {

    @Autowired
    private ContaService contaService;

    @PostMapping
    public ResponseEntity<ContaDTO> adicionarConta(@RequestBody ContaDTO contaDTO) {
        return contaService.adicionarConta(contaDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContaDTO> buscarContaPorId(@PathVariable Long id) {
        return contaService.buscarContaPorId(id);
    }

    @GetMapping
    public ResponseEntity<List<ContaDTO>> listarContasPorUsuario(@RequestParam Long idUsuario) {
        return contaService.listarContasPorUsuario(idUsuario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContaDTO> alterarConta(@PathVariable Long id, @RequestBody ContaDTO contaDTO) {
        return contaService.alterarConta(id, contaDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarConta(@PathVariable Long id) {
        return contaService.deletarConta(id);
    }
    
}
