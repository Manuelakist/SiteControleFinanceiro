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

import com.financeiro.dto.MetaDTO;
import com.financeiro.service.MetaService;

@RestController
@RequestMapping("/meta")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ControllerMeta {
    
    @Autowired
    private MetaService metaService;

    @PostMapping
    public ResponseEntity<MetaDTO> adicionarMeta(@RequestBody MetaDTO metaDTO) {
        return metaService.adicionarMeta(metaDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MetaDTO> buscarMetaPorId(@PathVariable Long id) {
        return metaService.buscarMetaPorId(id);
    }

    @GetMapping
    public ResponseEntity<List<MetaDTO>> listarMetasPorConta(@RequestParam Long idConta) {
        return metaService.listarMetasPorConta(idConta);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MetaDTO> alterarMeta(@PathVariable Long id, @RequestBody MetaDTO metaDTO) {
        return metaService.alterarMeta(id, metaDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarMeta(@PathVariable Long id) {
        return metaService.deletarMeta(id);
    }
}
