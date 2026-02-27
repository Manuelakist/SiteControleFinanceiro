package com.financeiro.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.financeiro.dto.OrcamentoDTO;
import com.financeiro.entities.CategoriaDespesa;
import com.financeiro.entities.Conta;
import com.financeiro.entities.Orcamento;
import com.financeiro.repository.CategoriaDespesaRepository;
import com.financeiro.repository.ContaRepository;
import com.financeiro.repository.OrcamentoRepository;
import com.financeiro.util.CategoriaDespesaMapper;
import com.financeiro.util.ContaMapper;
import com.financeiro.util.OrcamentoMapper;

@Service
public class OrcamentoService {

    @Autowired
    private OrcamentoRepository orcamentoRepository;

    @Autowired
    private ContaRepository contaRepository;

    @Autowired 
    private CategoriaDespesaRepository categoriaDespesaRepository;

    public ResponseEntity<OrcamentoDTO> adicionarOrcamento(OrcamentoDTO orcamentoDTO) {

        Conta conta = contaRepository.findById(orcamentoDTO.getContaDTO().getId()).orElseThrow(() -> new RuntimeException("Conta não encontrada"));
        orcamentoDTO.setContaDTO(ContaMapper.paraDTO(conta));
        CategoriaDespesa categoriaDespesa = categoriaDespesaRepository.findById(orcamentoDTO.getCategoriaDespesaDTO().getId()).orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
        orcamentoDTO.setCategoriaDespesaDTO(CategoriaDespesaMapper.paraDTO(categoriaDespesa));

        Orcamento orcamento = OrcamentoMapper.paraEntity(orcamentoDTO);
        Orcamento orcamentoSalvo = new Orcamento();

        try {
            orcamentoSalvo = orcamentoRepository.save(orcamento);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        orcamentoDTO.setId(orcamentoSalvo.getId());
        
        return ResponseEntity.ok(orcamentoDTO);
    }

    public ResponseEntity<OrcamentoDTO> buscarOrcamentoPorId(Long id) {

        Optional<OrcamentoDTO> orcamentoDTO = OrcamentoMapper.paraDtoOptional(orcamentoRepository.findById(id));

        return orcamentoDTO.map(orcamento -> ResponseEntity.ok(orcamento)).orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<List<OrcamentoDTO>> listarOrcamentosPorConta(Long idConta) {

        List<Orcamento> orcamentos = orcamentoRepository.findByContaId(idConta);
        List<OrcamentoDTO> orcamentosDTO = orcamentos.stream().map(orcamento -> OrcamentoMapper.paraDTO(orcamento)).collect(Collectors.toList());

        return ResponseEntity.ok(orcamentosDTO);
    }

    public ResponseEntity<OrcamentoDTO> alterarOrcamento(Long id, OrcamentoDTO orcamentoDTO) {

        OrcamentoDTO orcamentoAlterado = orcamentoRepository.findById(id).map(orcamento -> {
            Conta conta = contaRepository.findById(orcamentoDTO.getContaDTO().getId()).orElseThrow(() -> new RuntimeException("Conta não encontrada"));
            CategoriaDespesa categoriaDespesa = categoriaDespesaRepository.findById(orcamentoDTO.getCategoriaDespesaDTO().getId()).orElseThrow(() -> new RuntimeException("Categoria não encotnrada"));
            orcamento.setValor(orcamentoDTO.getValor());
            orcamento.setConta(conta);
            orcamento.setCategoriaDespesa(categoriaDespesa);
            orcamentoRepository.save(orcamento);
            return OrcamentoMapper.paraDTO(orcamento);
        }).orElseThrow(() -> new RuntimeException("Orçamento não encontrado"));

        return ResponseEntity.ok(orcamentoAlterado);
    }

    public ResponseEntity<Void> deletarOrcamento(Long id) {

        Optional<Orcamento> orcamento = orcamentoRepository.findById(id);

        if (orcamento.isPresent()) {
            orcamentoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }

    }
    
}
