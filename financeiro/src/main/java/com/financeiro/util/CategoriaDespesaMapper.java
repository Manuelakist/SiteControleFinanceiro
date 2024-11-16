package com.financeiro.util;

import java.util.Optional;

import com.financeiro.dto.CategoriaDespesaDTO;
import com.financeiro.dto.ContaDTO;
import com.financeiro.entities.CategoriaDespesa;
import com.financeiro.entities.Conta;

public class CategoriaDespesaMapper {
    
    public static CategoriaDespesaDTO paraDTO(CategoriaDespesa categoriaDespesa) {

        ContaDTO contaDTO = ContaMapper.paraDTO(categoriaDespesa.getConta());
        CategoriaDespesaDTO categoriaDespesaDTO = new CategoriaDespesaDTO();
        categoriaDespesaDTO.setId(categoriaDespesa.getId());
        categoriaDespesaDTO.setNome(categoriaDespesa.getNome());
        categoriaDespesaDTO.setContaDTO(contaDTO);

        return categoriaDespesaDTO;
    }

    public static CategoriaDespesa paraEntity(CategoriaDespesaDTO categoriaDespesaDTO) {

        Conta conta = ContaMapper.paraEntity(categoriaDespesaDTO.getContaDTO());
        CategoriaDespesa categoriaDespesa = new CategoriaDespesa();
        categoriaDespesa.setId(categoriaDespesaDTO.getId());
        categoriaDespesa.setNome(categoriaDespesaDTO.getNome());
        categoriaDespesa.setConta(conta);

        return categoriaDespesa;
    }

    public static Optional<CategoriaDespesaDTO> paraDtoOptional(Optional<CategoriaDespesa> categoriaDespesa) {

        Optional<CategoriaDespesaDTO> categoriaDTO = categoriaDespesa.map(categoria -> new CategoriaDespesaDTO(categoria.getId(), categoria.getNome(), ContaMapper.paraDTO(categoria.getConta())));

        return categoriaDTO;
    }

}
