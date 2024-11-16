package com.financeiro.controller;

import java.math.BigDecimal;
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
import org.springframework.web.bind.annotation.RestController;

import com.financeiro.dto.DepositoDTO;
import com.financeiro.service.DepositoService;

@RestController
@RequestMapping("/deposito")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ControllerDeposito {

    @Autowired
    private DepositoService depositoService;

    @PostMapping
    public ResponseEntity<DepositoDTO> adicionarDeposito(@RequestBody DepositoDTO depositoDTO) {
        return depositoService.adicionarDeposito(depositoDTO);
    }

    @GetMapping("/{idMeta}")
    public ResponseEntity<List<DepositoDTO>> listarDepositosPorMeta(@PathVariable Long idMeta) {
        return depositoService.listarDepositosPorConta(idMeta);
    }

    @GetMapping("/soma/{idMeta}")
    public ResponseEntity<BigDecimal> somarDepositos(@PathVariable Long idMeta) {
        return depositoService.somarDepositos(idMeta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarDeposito(@PathVariable Long id) {
        return depositoService.deletarDeposito(id);
    }
    
}
