package com.financeiro.util;

import java.util.Optional;

import com.financeiro.dto.CategoriaDespesaDTO;
import com.financeiro.dto.ContaDTO;
import com.financeiro.dto.DespesaDTO;
import com.financeiro.entities.CategoriaDespesa;
import com.financeiro.entities.Conta;
import com.financeiro.entities.Despesa;

public class DespesaMapper {
    
    public static DespesaDTO paraDTO(Despesa despesa) {

        ContaDTO contaDTO = ContaMapper.paraDTO(despesa.getConta());
        CategoriaDespesaDTO categoriaDespesaDTO = CategoriaDespesaMapper.paraDTO(despesa.getCategoriaDespesa());

        DespesaDTO despesaDTO = new DespesaDTO();
        despesaDTO.setId(despesa.getId());
        despesaDTO.setDescricao(despesa.getDescricao());
        despesaDTO.setTipo(despesa.getTipo());
        despesaDTO.setValor(despesa.getValor());
        despesaDTO.setTempo(despesa.getTempo());
        despesaDTO.setData(despesa.getData());
        despesaDTO.setContaDTO(contaDTO);
        despesaDTO.setCategoriaDespesaDTO(categoriaDespesaDTO);

        return despesaDTO;
    }

    public static Despesa paraEntity(DespesaDTO despesaDTO) {

        Conta conta = ContaMapper.paraEntity(despesaDTO.getContaDTO());
        CategoriaDespesa categoriaDespesa = CategoriaDespesaMapper.paraEntity(despesaDTO.getCategoriaDespesaDTO());

        Despesa despesa = new Despesa();
        despesa.setId(despesaDTO.getId());
        despesa.setDescricao(despesaDTO.getDescricao());
        despesa.setTipo(despesaDTO.getTipo());
        despesa.setValor(despesaDTO.getValor());
        despesa.setTempo(despesaDTO.getTempo());
        despesa.setData(despesaDTO.getData());
        despesa.setConta(conta);
        despesa.setCategoriaDespesa(categoriaDespesa);

        return despesa;
    }

    public static Optional<DespesaDTO> paraDtoOptional(Optional<Despesa> despesa) {

        Optional<DespesaDTO> despesaDTO = despesa.map(despesaMap -> new DespesaDTO(despesaMap.getId(), despesaMap.getDescricao(), despesaMap.getTipo(), despesaMap.getValor(), despesaMap.getTempo(), despesaMap.getData(), ContaMapper.paraDTO(despesaMap.getConta()), CategoriaDespesaMapper.paraDTO(despesaMap.getCategoriaDespesa())));

        return despesaDTO;
    }

}
