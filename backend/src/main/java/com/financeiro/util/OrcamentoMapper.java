package com.financeiro.util;

import java.util.Optional;

import com.financeiro.dto.CategoriaDespesaDTO;
import com.financeiro.dto.ContaDTO;
import com.financeiro.dto.OrcamentoDTO;
import com.financeiro.entities.CategoriaDespesa;
import com.financeiro.entities.Conta;
import com.financeiro.entities.Orcamento;

public class OrcamentoMapper {
    
    public static OrcamentoDTO paraDTO(Orcamento orcamento) {

        ContaDTO contaDTO = ContaMapper.paraDTO(orcamento.getConta());
        CategoriaDespesaDTO categoriaDespesaDTO = CategoriaDespesaMapper.paraDTO(orcamento.getCategoriaDespesa());
        OrcamentoDTO orcamentoDTO = new OrcamentoDTO();
        orcamentoDTO.setId(orcamento.getId());
        orcamentoDTO.setValor(orcamento.getValor());
        orcamentoDTO.setContaDTO(contaDTO);
        orcamentoDTO.setCategoriaDespesaDTO(categoriaDespesaDTO);

        return orcamentoDTO;
    }

    public static Orcamento paraEntity(OrcamentoDTO orcamentoDTO) {

        Conta conta = ContaMapper.paraEntity(orcamentoDTO.getContaDTO());
        CategoriaDespesa categoriaDespesa = CategoriaDespesaMapper.paraEntity(orcamentoDTO.getCategoriaDespesaDTO());
        Orcamento orcamento = new Orcamento();
        orcamento.setId(orcamentoDTO.getId());
        orcamento.setValor(orcamentoDTO.getValor());
        orcamento.setConta(conta);
        orcamento.setCategoriaDespesa(categoriaDespesa);

        return orcamento;
    }

    public static Optional<OrcamentoDTO> paraDtoOptional(Optional<Orcamento> orcamento) {

        Optional<OrcamentoDTO> orcamentoDTO = orcamento.map(orcamentoMap -> new OrcamentoDTO(orcamentoMap.getId(), orcamentoMap.getValor(), ContaMapper.paraDTO(orcamentoMap.getConta()), CategoriaDespesaMapper.paraDTO(orcamentoMap.getCategoriaDespesa())));

        return orcamentoDTO;
    }

}
