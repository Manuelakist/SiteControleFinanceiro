package com.financeiro.util;

import java.util.Optional;

import com.financeiro.dto.CategoriaReceitaDTO;
import com.financeiro.dto.ContaDTO;
import com.financeiro.dto.ReceitaDTO;
import com.financeiro.entities.CategoriaReceita;
import com.financeiro.entities.Conta;

import com.financeiro.entities.Receita;

public class ReceitaMapper {

    public static ReceitaDTO paraDTO(Receita receita) {

        ContaDTO contaDTO = ContaMapper.paraDTO(receita.getConta());
        CategoriaReceitaDTO categoriaReceitaDTO = CategoriaReceitaMapper.paraDTO(receita.getCategoriaReceita());

        ReceitaDTO receitaDTO = new ReceitaDTO();
        receitaDTO.setId(receita.getId());
        receitaDTO.setDescricao(receita.getDescricao());
        receitaDTO.setTipo(receita.getTipo());
        receitaDTO.setValor(receita.getValor());
        receitaDTO.setTempo(receita.getTempo());
        receitaDTO.setData(receita.getData());
        receitaDTO.setContaDTO(contaDTO);
        receitaDTO.setCategoriaReceitaDTO(categoriaReceitaDTO);

        return receitaDTO;
    }

    public static Receita paraEntity(ReceitaDTO receitaDTO) {

        Conta conta = ContaMapper.paraEntity(receitaDTO.getContaDTO());
        CategoriaReceita categoriaReceita = CategoriaReceitaMapper.paraEntity(receitaDTO.getCategoriaReceitaDTO());

        Receita receita = new Receita();
        receita.setId(receitaDTO.getId());
        receita.setDescricao(receitaDTO.getDescricao());
        receita.setTipo(receitaDTO.getTipo());
        receita.setValor(receitaDTO.getValor());
        receita.setTempo(receitaDTO.getTempo());
        receita.setData(receitaDTO.getData());
        receita.setConta(conta);
        receita.setCategoriaReceita(categoriaReceita);

        return receita;
    }

    public static Optional<ReceitaDTO> paraDtoOptional(Optional<Receita> receita) {

        Optional<ReceitaDTO> receitaDTO = receita.map(receitaMap -> new ReceitaDTO(receitaMap.getId(), receitaMap.getDescricao(), receitaMap.getTipo(), receitaMap.getValor(), receitaMap.getTempo(), receitaMap.getData(), ContaMapper.paraDTO(receitaMap.getConta()), CategoriaReceitaMapper.paraDTO(receitaMap.getCategoriaReceita())));

        return receitaDTO;
    }

}