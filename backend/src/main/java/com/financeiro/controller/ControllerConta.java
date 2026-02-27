package com.financeiro.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.financeiro.dto.ContaDTO;
import com.financeiro.service.ContaService;

/**
 * Controlador REST para gestão de contas financeiras.
 * As políticas de CORS são geridas globalmente pela classe CorsConfig.
 */
@RestController
@RequestMapping("/conta")
@CrossOrigin(origins = "*")
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

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<ContaDTO>> listarContasPorUsuario(@PathVariable Long idUsuario) { // <-- Mudou de @RequestParam para @PathVariable
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