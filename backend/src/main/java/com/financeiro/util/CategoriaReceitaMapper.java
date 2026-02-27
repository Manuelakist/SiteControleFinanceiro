package com.financeiro.util;

import java.util.Optional;

import com.financeiro.dto.CategoriaReceitaDTO;
import com.financeiro.dto.ContaDTO;
import com.financeiro.entities.CategoriaReceita;
import com.financeiro.entities.Conta;

public class CategoriaReceitaMapper {

    public static CategoriaReceitaDTO paraDTO(CategoriaReceita categoriaReceita) {

        ContaDTO contaDTO = ContaMapper.paraDTO(categoriaReceita.getConta());
        CategoriaReceitaDTO categoriaReceitaDTO = new CategoriaReceitaDTO();
        categoriaReceitaDTO.setId(categoriaReceita.getId());
        categoriaReceitaDTO.setNome(categoriaReceita.getNome());
        categoriaReceitaDTO.setContaDTO(contaDTO);

        return categoriaReceitaDTO;
    }

    public static CategoriaReceita paraEntity(CategoriaReceitaDTO categoriaReceitaDTO) {

        Conta conta = ContaMapper.paraEntity(categoriaReceitaDTO.getContaDTO());
        CategoriaReceita categoriaReceita = new CategoriaReceita();
        categoriaReceita.setId(categoriaReceitaDTO.getId());
        categoriaReceita.setNome(categoriaReceitaDTO.getNome());
        categoriaReceita.setConta(conta);

        return categoriaReceita;
    }

    public static Optional<CategoriaReceitaDTO> paraDtoOptional(Optional<CategoriaReceita> categoriaReceita) {

        Optional<CategoriaReceitaDTO> categoriaDTO = categoriaReceita.map(categoria -> new CategoriaReceitaDTO(categoria.getId(), categoria.getNome(), ContaMapper.paraDTO(categoria.getConta())));

        return categoriaDTO;
    }
    
}
