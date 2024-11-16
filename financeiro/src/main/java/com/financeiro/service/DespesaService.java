package com.financeiro.service;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.financeiro.dto.DespesaDTO;
import com.financeiro.entities.CategoriaDespesa;
import com.financeiro.entities.Conta;
import com.financeiro.entities.Despesa;
import com.financeiro.repository.CategoriaDespesaRepository;
import com.financeiro.repository.ContaRepository;
import com.financeiro.repository.DespesaRepository;
import com.financeiro.util.CategoriaDespesaMapper;
import com.financeiro.util.ContaMapper;
import com.financeiro.util.DespesaMapper;

@Service
public class DespesaService {

    @Autowired
    private DespesaRepository despesaRepository;

    @Autowired
    private ContaRepository contaRepository;

    @Autowired
    private CategoriaDespesaRepository categoriaDespesaRepository;

    public ResponseEntity<List<DespesaDTO>> adicionarDespesa(DespesaDTO despesaDTO) {

        Conta conta = contaRepository.findById(despesaDTO.getContaDTO().getId()).orElseThrow(() -> new RuntimeException("Conta não encontrada"));
        CategoriaDespesa categoriaDespesa = categoriaDespesaRepository.findById(despesaDTO.getCategoriaDespesaDTO().getId()).orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
        despesaDTO.setContaDTO(ContaMapper.paraDTO(conta));
        despesaDTO.setCategoriaDespesaDTO(CategoriaDespesaMapper.paraDTO(categoriaDespesa));

        List<DespesaDTO> despesasCadastradas = new ArrayList<>();

        LocalDate dataInicial = despesaDTO.getData().toLocalDate();

        for (int i = 0; i < despesaDTO.getTempo(); i++) {

            DespesaDTO novaDespesaDTO = new DespesaDTO(despesaDTO);
            LocalDate novaData = dataInicial.plusMonths(i);
            novaDespesaDTO.setData(java.sql.Date.valueOf(novaData));

            Despesa despesa = DespesaMapper.paraEntity(novaDespesaDTO);

            try {
                Despesa despesaSalva = despesaRepository.save(despesa);
                novaDespesaDTO.setId(despesaSalva.getId());
                despesasCadastradas.add(novaDespesaDTO);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }

        }
        
        return ResponseEntity.ok(despesasCadastradas);
    }

    public ResponseEntity<DespesaDTO> buscarDespesaPorId(Long id) {

        Optional<DespesaDTO> despesaDTO = DespesaMapper.paraDtoOptional(despesaRepository.findById(id));

        return despesaDTO.map(despesa -> ResponseEntity.ok(despesa)).orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<List<DespesaDTO>> listarDespesasPorConta(Long idConta, Date dataInicial, Date dataFinal) {

        List<Despesa> despesas = despesaRepository.findByContaIdAndDataBetween(idConta, dataInicial, dataFinal);
        List<DespesaDTO> despesasDTO = despesas.stream().map(despesa -> DespesaMapper.paraDTO(despesa)).collect(Collectors.toList());

        return ResponseEntity.ok(despesasDTO);
    }
    
    public ResponseEntity<List<DespesaDTO>> listarDespesasPorCategoria(Long idCategoria, Date dataInicial, Date dataFinal) {

        List<Despesa> despesas = despesaRepository.findByCategoriaDespesaIdAndDataBetween(idCategoria, dataInicial, dataFinal);
        List<DespesaDTO> despesasDTO = despesas.stream().map(despesa -> DespesaMapper.paraDTO(despesa)).collect(Collectors.toList());

        return ResponseEntity.ok(despesasDTO);
    }
    
    public ResponseEntity<BigDecimal> somarDespesas(Long idConta, Date dataInicial, Date dataFinal) {

        BigDecimal soma = despesaRepository.somarDespesas(idConta, dataInicial, dataFinal);

        return ResponseEntity.ok(soma);
    }

    public ResponseEntity<BigDecimal> somarDespesasPorCategoria(Long idCategoria, Date dataInicial, Date dataFinal) {
        BigDecimal soma = despesaRepository.somarDespesasPorCategoria(idCategoria, dataInicial, dataFinal);

        return ResponseEntity.ok(soma);
    }

    public ResponseEntity<List<DespesaDTO>> alterarDespesa(Long id, DespesaDTO despesaDTO) {

        List<DespesaDTO> despesasAlteradas = new ArrayList<>();

        Despesa despesa = despesaRepository.findById(id).orElseThrow(() -> new RuntimeException("Despesa não encontrada"));

        Conta conta = contaRepository.findById(despesaDTO.getContaDTO().getId()).orElseThrow(() -> new RuntimeException("Conta não encontrada"));
        CategoriaDespesa categoriaDespesa = categoriaDespesaRepository.findById(despesaDTO.getCategoriaDespesaDTO().getId()).orElseThrow(() -> new RuntimeException("Categoria não encotnrada"));

        if (despesa.getTipo().equals("pontual")) {
            despesa.setDescricao(despesaDTO.getDescricao());
            despesa.setValor(despesaDTO.getValor());
            despesa.setData(despesaDTO.getData());
            despesa.setConta(conta);
            despesa.setCategoriaDespesa(categoriaDespesa);
            despesaRepository.save(despesa);
            despesasAlteradas.add(DespesaMapper.paraDTO(despesa));
        } else {
            List<DespesaDTO> despesas = buscarDespesasCompostas(despesa.getConta().getId(), despesa.getDescricao());

            for (int i = 0; i < despesas.size(); i++) {
                Despesa alteracao = DespesaMapper.paraEntity(despesas.get(i));

                LocalDate dataOriginal = alteracao.getData().toLocalDate();
                System.out.println("data original: " + dataOriginal);
                LocalDate novaData = despesaDTO.getData().toLocalDate();
                System.out.println("nova data: " + novaData);
                LocalDate dataAtualizada = dataOriginal.withDayOfMonth(novaData.getDayOfMonth());
                System.out.println("data atualizada: " + dataAtualizada);
                System.out.println("data atualizada convertida: " + java.sql.Date.valueOf(dataAtualizada));
                System.out.println(java.util.TimeZone.getDefault());

                alteracao.setDescricao(despesaDTO.getDescricao());
                alteracao.setValor(despesaDTO.getValor());
                alteracao.setData(java.sql.Date.valueOf(dataAtualizada));
                alteracao.setConta(conta);
                alteracao.setCategoriaDespesa(categoriaDespesa);
                despesaRepository.save(alteracao);
                despesasAlteradas.add(DespesaMapper.paraDTO(alteracao));
            }
        }

        return ResponseEntity.ok(despesasAlteradas);
    }  

    public ResponseEntity<Void> deletarDespesa(Long id) {

        Optional<Despesa> despesaOptional = despesaRepository.findById(id);

        if (despesaOptional.isPresent()) {

            Despesa despesa = despesaOptional.map(despesaMap -> despesaMap).orElseThrow(() -> new RuntimeException());

            if (despesa.getTipo().equals("pontual")) {
                despesaRepository.deleteById(id);
                return ResponseEntity.noContent().build();
            } else {
                List<Despesa> despesas = buscarDespesasCompostas(despesa.getConta().getId(), despesa.getDescricao()).stream().map(despesaMap -> DespesaMapper.paraEntity(despesaMap)).collect(Collectors.toList());
                despesaRepository.deleteAll(despesas);
                return ResponseEntity.noContent().build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    public List<DespesaDTO> buscarDespesasCompostas(Long idConta, String descricao) {

        List<Despesa> despesas = despesaRepository.findByContaIdAndDescricao(idConta, descricao);
        List<DespesaDTO> despesasDTO = despesas.stream().map(despesa -> DespesaMapper.paraDTO(despesa)).collect(Collectors.toList());

        return despesasDTO;
    }

}
