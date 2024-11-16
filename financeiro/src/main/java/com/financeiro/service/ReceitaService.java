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

import com.financeiro.dto.ReceitaDTO;
import com.financeiro.entities.CategoriaReceita;
import com.financeiro.entities.Conta;
import com.financeiro.entities.Receita;
import com.financeiro.repository.CategoriaReceitaRepository;
import com.financeiro.repository.ContaRepository;
import com.financeiro.repository.ReceitaRepository;
import com.financeiro.util.CategoriaReceitaMapper;
import com.financeiro.util.ContaMapper;
import com.financeiro.util.ReceitaMapper;

@Service
public class ReceitaService {

    @Autowired
    private ReceitaRepository receitaRepository;

    @Autowired
    private ContaRepository contaRepository;

    @Autowired
    private CategoriaReceitaRepository categoriaReceitaRepository;

    public ResponseEntity<List<ReceitaDTO>> adicionarReceita(ReceitaDTO receitaDTO) {

        Conta conta = contaRepository.findById(receitaDTO.getContaDTO().getId()).orElseThrow(() -> new RuntimeException("Conta não encontrada"));
        CategoriaReceita categoriaReceita = categoriaReceitaRepository.findById(receitaDTO.getCategoriaReceitaDTO().getId()).orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
        receitaDTO.setContaDTO(ContaMapper.paraDTO(conta));
        receitaDTO.setCategoriaReceitaDTO(CategoriaReceitaMapper.paraDTO(categoriaReceita));

        List<ReceitaDTO> receitasCadastradas = new ArrayList<>();

        LocalDate dataInicial = receitaDTO.getData().toLocalDate();

        for (int i = 0; i < receitaDTO.getTempo(); i++) {

            ReceitaDTO novaReceitaDTO = new ReceitaDTO(receitaDTO);
            LocalDate novaData = dataInicial.plusMonths(i);
            novaReceitaDTO.setData(java.sql.Date.valueOf(novaData));

            Receita receita = ReceitaMapper.paraEntity(novaReceitaDTO);

            try {
                Receita receitaSalva = receitaRepository.save(receita);
                novaReceitaDTO.setId(receitaSalva.getId());
                receitasCadastradas.add(novaReceitaDTO);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }

        }
        
        return ResponseEntity.ok(receitasCadastradas);
    }

    public ResponseEntity<ReceitaDTO> buscarReceitaPorId(Long id) {

        Optional<ReceitaDTO> receitaDTO = ReceitaMapper.paraDtoOptional(receitaRepository.findById(id));

        return receitaDTO.map(receita -> ResponseEntity.ok(receita)).orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<List<ReceitaDTO>> listarReceitasPorConta(Long idConta, Date dataInicial, Date dataFinal) {

        List<Receita> receitas = receitaRepository.findByContaIdAndDataBetween(idConta, dataInicial, dataFinal);
        List<ReceitaDTO> receitasDTO = receitas.stream().map(receita -> ReceitaMapper.paraDTO(receita)).collect(Collectors.toList());

        return ResponseEntity.ok(receitasDTO);
    }
    
    public ResponseEntity<List<ReceitaDTO>> listarReceitasPorCategoria(Long idCategoria, Date dataInicial, Date dataFinal) {

        List<Receita> receitas = receitaRepository.findByCategoriaReceitaIdAndDataBetween(idCategoria, dataInicial, dataFinal);
        List<ReceitaDTO> receitasDTO = receitas.stream().map(receita -> ReceitaMapper.paraDTO(receita)).collect(Collectors.toList());

        return ResponseEntity.ok(receitasDTO);
    }
    
    public ResponseEntity<BigDecimal> somarReceitas(Long idConta, Date dataInicial, Date dataFinal) {

        BigDecimal soma = receitaRepository.somarReceitas(idConta, dataInicial, dataFinal);

        return ResponseEntity.ok(soma);
    }

    public ResponseEntity<BigDecimal> somarReceitasPorCategoria(Long idConta, Long idCategoria, Date dataInicial, Date dataFinal) {
        BigDecimal soma = receitaRepository.somarReceitasPorCategoria(idConta, idCategoria, dataInicial, dataFinal);

        return ResponseEntity.ok(soma);
    }

    public ResponseEntity<List<ReceitaDTO>> alterarReceita(Long id, ReceitaDTO receitaDTO) {

        List<ReceitaDTO> receitasAlteradas = new ArrayList<>();

        Receita receita = receitaRepository.findById(id).orElseThrow(() -> new RuntimeException("Receita não encontrada"));

        Conta conta = contaRepository.findById(receitaDTO.getContaDTO().getId()).orElseThrow(() -> new RuntimeException("Conta não encontrada"));
        CategoriaReceita categoriaReceita = categoriaReceitaRepository.findById(receitaDTO.getCategoriaReceitaDTO().getId()).orElseThrow(() -> new RuntimeException("Categoria não encotnrada"));

        if (receita.getTipo().equals("pontual")) {
            receita.setDescricao(receitaDTO.getDescricao());
            receita.setValor(receitaDTO.getValor());
            receita.setData(receitaDTO.getData());
            receita.setConta(conta);
            receita.setCategoriaReceita(categoriaReceita);
            receitaRepository.save(receita);
            receitasAlteradas.add(ReceitaMapper.paraDTO(receita));
        } else {
            List<ReceitaDTO> receitas = listarReceitasCompostas(receita.getConta().getId(), receita.getDescricao());

            for (int i = 0; i < receitas.size(); i++) {
                Receita alteracao = ReceitaMapper.paraEntity(receitas.get(i));

                LocalDate dataOriginal = alteracao.getData().toLocalDate();
                LocalDate novaData = receitaDTO.getData().toLocalDate();
                LocalDate dataAtualizada = dataOriginal.withDayOfMonth(novaData.getDayOfMonth());
    
                alteracao.setDescricao(receitaDTO.getDescricao());
                alteracao.setValor(receitaDTO.getValor());
                alteracao.setData(java.sql.Date.valueOf(dataAtualizada));
                alteracao.setConta(conta);
                alteracao.setCategoriaReceita(categoriaReceita);
                receitaRepository.save(alteracao);
                receitasAlteradas.add(ReceitaMapper.paraDTO(alteracao));
            }
        }

        return ResponseEntity.ok(receitasAlteradas);
    }  

    public ResponseEntity<Void> deletarReceita(Long id) {

        Optional<Receita> receitaOptional = receitaRepository.findById(id);

        if (receitaOptional.isPresent()) {

            Receita receita = receitaOptional.map(receitaMap -> receitaMap).orElseThrow(() -> new RuntimeException());

            if (receita.getTipo().equals("pontual")) {
                receitaRepository.deleteById(id);
                return ResponseEntity.noContent().build();
            } else {
                List<Receita> receitas = listarReceitasCompostas(receita.getConta().getId(), receita.getDescricao()).stream().map(receitaMap -> ReceitaMapper.paraEntity(receitaMap)).collect(Collectors.toList());
                receitaRepository.deleteAll(receitas);
                return ResponseEntity.noContent().build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    public List<ReceitaDTO> listarReceitasCompostas(Long idConta, String descricao) {

        List<Receita> receitas = receitaRepository.findByContaIdAndDescricao(idConta, descricao);
        List<ReceitaDTO> receitasDTO = receitas.stream().map(receita -> ReceitaMapper.paraDTO(receita)).collect(Collectors.toList());

        return receitasDTO;
    }
    
}