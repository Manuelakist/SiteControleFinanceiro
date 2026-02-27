package com.financeiro.util;

import java.util.Optional;

import com.financeiro.dto.DepositoDTO;
import com.financeiro.dto.MetaDTO;
import com.financeiro.entities.Deposito;
import com.financeiro.entities.Meta;

public class DepositoMapper {
    
    public static DepositoDTO paraDTO(Deposito deposito) {
        MetaDTO metaDTO = MetaMapper.paraDTO(deposito.getMeta());
        DepositoDTO depositoDTO = new DepositoDTO();
        depositoDTO.setId(deposito.getId());
        depositoDTO.setValor(deposito.getValor());
        depositoDTO.setData(deposito.getData());
        depositoDTO.setMetaDTO(metaDTO);

        return depositoDTO;
    } 

    public static Deposito paraEntity(DepositoDTO depositoDTO) {
        Meta meta = MetaMapper.paraEntity(depositoDTO.getMetaDTO());
        Deposito deposito = new Deposito();
        deposito.setId(depositoDTO.getId());
        deposito.setValor(depositoDTO.getValor());
        deposito.setData(depositoDTO.getData());
        deposito.setMeta(meta);

        return deposito;
    }

    public static Optional<DepositoDTO> paraDtoOptional(Optional<Deposito> deposito) {

        Optional<DepositoDTO> depositoDTO = deposito.map(depositoMap -> new DepositoDTO(depositoMap.getId(), depositoMap.getValor(), depositoMap.getData(), MetaMapper.paraDTO(depositoMap.getMeta())));

        return depositoDTO;
    }

}
