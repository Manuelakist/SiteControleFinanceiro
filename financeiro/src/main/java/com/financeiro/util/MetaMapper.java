package com.financeiro.util;

import java.util.Optional;

import com.financeiro.dto.ContaDTO;
import com.financeiro.dto.MetaDTO;
import com.financeiro.entities.Conta;
import com.financeiro.entities.Meta;

public class MetaMapper {

    public static MetaDTO paraDTO(Meta meta) {

        ContaDTO contaDTO = ContaMapper.paraDTO(meta.getConta());
        MetaDTO metaDTO = new MetaDTO();
        metaDTO.setId(meta.getId());
        metaDTO.setObjetivo(meta.getObjetivo());
        metaDTO.setValor(meta.getValor());
        metaDTO.setDataInicio(meta.getDataInicio());
        metaDTO.setDataFim(meta.getDataFim());
        metaDTO.setContaDTO(contaDTO);

        return metaDTO;
    }

    public static Meta paraEntity(MetaDTO metaDTO) {

        Conta conta = ContaMapper.paraEntity(metaDTO.getContaDTO());
        Meta meta = new Meta();
        meta.setId(metaDTO.getId());
        meta.setObjetivo(metaDTO.getObjetivo());
        meta.setValor(metaDTO.getValor());
        meta.setDataInicio(metaDTO.getDataInicio());
        meta.setDataFim(metaDTO.getDataFim());
        meta.setConta(conta);

        return meta;
    }

    public static Optional<MetaDTO> paraDtoOptional(Optional<Meta> meta) {

        Optional<MetaDTO> metaDTO = meta.map(metaMap -> new MetaDTO(metaMap.getId(), metaMap.getObjetivo(), metaMap.getValor(), metaMap.getDataInicio(), metaMap.getDataFim(), ContaMapper.paraDTO(metaMap.getConta())));

        return metaDTO;
    }
    
}
